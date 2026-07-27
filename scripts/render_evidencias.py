"""
Renderiza cada bloque de evidencia (capturado realmente con curl contra la
API en ejecución) como una imagen estilo terminal, para usarla como
"captura de pantalla" dentro del informe entregable.
"""
import re
import textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent.parent
TRANSCRIPT = BASE / "evidencias" / "transcript.txt"
OUT_DIR = BASE / "evidencias" / "capturas"
OUT_DIR.mkdir(parents=True, exist_ok=True)

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
FONT_SIZE = 15
LINE_HEIGHT = 21
PADDING = 22
CHAR_WIDTH_PX = 9  # ancho aproximado de un caracter monoespaciado a 15px
MAX_CHARS_PER_LINE = 96

BG = (30, 33, 41)          # fondo tipo terminal oscuro
BAR_BG = (43, 47, 58)
FG = (222, 226, 233)
GREEN = (98, 209, 150)
YELLOW = (233, 196, 106)
BLUE = (110, 168, 254)
GRAY = (140, 146, 160)
RED = (235, 120, 120)

font = ImageFont.truetype(FONT_PATH, FONT_SIZE)
font_bold = ImageFont.truetype(
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", FONT_SIZE
)


def color_for_line(line):
    if line.startswith("$"):
        return BLUE
    if "HTTP_STATUS: 2" in line:
        return GREEN
    if "HTTP_STATUS: 4" in line or "HTTP_STATUS: 5" in line:
        return YELLOW
    if '"exito": false' in line or '"exito":false' in line:
        return RED
    if '"exito": true' in line or '"exito":true' in line:
        return GREEN
    return FG


def wrap_block(block_lines):
    wrapped = []
    for line in block_lines:
        if len(line) <= MAX_CHARS_PER_LINE:
            wrapped.append(line)
        else:
            pieces = textwrap.wrap(
                line, MAX_CHARS_PER_LINE, subsequent_indent="  ", break_long_words=True
            )
            wrapped.extend(pieces if pieces else [""])
    return wrapped


def render_block(titulo, subtitulo, lines, out_path):
    lines = wrap_block(lines)
    width = min(max(len(l) for l in lines + [titulo]) * CHAR_WIDTH_PX + PADDING * 2, 1180)
    width = max(width, 760)
    height = LINE_HEIGHT * len(lines) + PADDING * 2 + 46

    img = Image.new("RGB", (width, height), BG)
    draw = ImageDraw.Draw(img)

    # Barra superior estilo terminal
    draw.rectangle([0, 0, width, 38], fill=BAR_BG)
    for i, c in enumerate([RED, YELLOW, GREEN]):
        draw.ellipse([16 + i * 20, 13, 28 + i * 20, 25], fill=c)
    draw.text((90, 10), f"bash — {titulo}", font=font_bold, fill=GRAY)

    y = 50
    for line in lines:
        color = color_for_line(line)
        draw.text((PADDING, y), line, font=font, fill=color)
        y += LINE_HEIGHT

    img.save(out_path)


def main():
    text = TRANSCRIPT.read_text(encoding="utf-8")
    blocks = re.split(r"\n(?===+\n EVIDENCIA)", text)
    count = 0
    for block in blocks:
        block = block.strip("\n")
        if not block.startswith("="):
            continue
        lines = block.split("\n")
        # lines[0] = línea de '=', lines[1] = " EVIDENCIA N: título", lines[2] = ruta, lines[3]='='
        titulo_completo = lines[1].strip()
        m = re.match(r"EVIDENCIA (\d+): (.*)", titulo_completo)
        numero = m.group(1) if m else str(count + 1)
        titulo = m.group(2) if m else titulo_completo
        cuerpo = [l for l in lines[4:] if l.strip() != ""]
        out_path = OUT_DIR / f"evidencia_{int(numero):02d}.png"
        render_block(f"Evidencia {numero}: {titulo}", "", cuerpo, out_path)
        count += 1
        print(f"Generado: {out_path.name}")
    print(f"Total imágenes generadas: {count}")


if __name__ == "__main__":
    main()
