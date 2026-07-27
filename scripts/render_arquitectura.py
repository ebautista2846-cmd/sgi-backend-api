from PIL import Image, ImageDraw, ImageFont

W, H = 1500, 520
BG = (255, 255, 255)
BOX_FILL = (241, 245, 249)
BOX_BORDER = (51, 65, 85)
ACCENT = (37, 99, 235)
TEXT = (30, 41, 59)
SUBTEXT = (100, 116, 139)

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

F_TITLE = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
F_SUB = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
F_SMALL = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)

boxes = [
    {"x": 40,  "w": 300, "title": "Cliente", "sub": "Postman / cURL / Frontend (Angular)"},
    {"x": 400, "w": 340, "title": "API REST — Express", "sub": "Rutas -> Middlewares -> Controladores"},
    {"x": 800, "w": 300, "title": "Capa de Modelo", "sub": "Consultas SQL parametrizadas (pg)"},
    {"x": 1160,"w": 300, "title": "PostgreSQL", "sub": "Tabla incidentes + índices + trigger"},
]

y, h = 160, 140

for b in boxes:
    x0, x1 = b["x"], b["x"] + b["w"]
    draw.rounded_rectangle([x0, y, x1, y + h], radius=14, fill=BOX_FILL, outline=BOX_BORDER, width=2)
    draw.text((x0 + b["w"]/2, y + 45), b["title"], font=F_TITLE, fill=TEXT, anchor="mm")
    # sub text wrapped manually (short strings, fits in two lines max)
    words = b["sub"].split(" ")
    line1, line2 = b["sub"], ""
    if len(b["sub"]) > 28:
        mid = len(words)//2
        line1 = " ".join(words[:mid])
        line2 = " ".join(words[mid:])
    draw.text((x0 + b["w"]/2, y + 85), line1, font=F_SUB, fill=SUBTEXT, anchor="mm")
    if line2:
        draw.text((x0 + b["w"]/2, y + 108), line2, font=F_SUB, fill=SUBTEXT, anchor="mm")

# arrows between boxes
for i in range(len(boxes) - 1):
    x_start = boxes[i]["x"] + boxes[i]["w"]
    x_end = boxes[i+1]["x"]
    ym = y + h/2
    draw.line([x_start + 6, ym, x_end - 10, ym], fill=ACCENT, width=3)
    draw.polygon([(x_end - 10, ym - 8), (x_end - 10, ym + 8), (x_end + 2, ym)], fill=ACCENT)

# labels above arrows (HTTP / SQL)
draw.text((boxes[0]["x"]+boxes[0]["w"] + (boxes[1]["x"]-boxes[0]["x"]-boxes[0]["w"])/2, y - 26),
          "HTTP/JSON", font=F_SMALL, fill=ACCENT, anchor="mm")
draw.text((boxes[1]["x"]+boxes[1]["w"] + (boxes[2]["x"]-boxes[1]["x"]-boxes[1]["w"])/2, y - 26),
          "Funciones JS", font=F_SMALL, fill=ACCENT, anchor="mm")
draw.text((boxes[2]["x"]+boxes[2]["w"] + (boxes[3]["x"]-boxes[2]["x"]-boxes[2]["w"])/2, y - 26),
          "SQL", font=F_SMALL, fill=ACCENT, anchor="mm")

# top title
draw.text((W/2, 60), "Arquitectura del Backend — Sistema de Gestión de Incidentes",
          font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28),
          fill=TEXT, anchor="mm")
draw.text((W/2, 95), "Patrón por capas: Rutas -> Middlewares de validación -> Controladores -> Modelo -> Base de datos",
          font=F_SUB, fill=SUBTEXT, anchor="mm")

# bottom note
draw.text((W/2, y + h + 50),
          "Cada capa tiene una única responsabilidad: las rutas definen los endpoints, los middlewares validan\n"
          "y filtran, los controladores orquestan la respuesta HTTP y el modelo aísla el acceso a datos.",
          font=F_SMALL, fill=SUBTEXT, anchor="mm", align="center")

img.save("/home/claude/incidentes-backend/evidencias/arquitectura.png")
print("ok")
