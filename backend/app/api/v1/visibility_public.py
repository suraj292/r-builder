from fastapi import APIRouter, Query, Response
from PIL import Image, ImageDraw, ImageFont
import io
import os

router = APIRouter()

@router.get("/og-image")
async def generate_og_image(
    title: str = Query("ResumeBP", description="The main title for the OG image"),
    subtitle: str = Query("AI-Powered Career Success", description="Secondary text")
):
    """
    Dynamically generates a branded Open Graph image for social sharing.
    """
    # Image dimensions for OG (1200x630)
    width, height = 1200, 630
    
    # Create a gradient background
    base = Image.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(base)
    
    # Draw a simple modern background (Indigo gradient simulation)
    for i in range(height):
        r = int(79 + (i / height) * 20)  # Start from Indigo-600 ish
        g = int(70 + (i / height) * 20)
        b = int(229 + (i / height) * 10)
        draw.line([(0, i), (width, i)], fill=(r, g, b))

    # Add some abstract shapes for "AI" look
    draw.ellipse([width-300, -100, width+100, 300], fill=(255, 255, 255, 30), outline=None)
    draw.ellipse([-100, height-200, 300, height+200], fill=(255, 255, 255, 20), outline=None)

    # In a real production setup, we'd load a specific font file. 
    # For now, we'll try to find a default or use basic.
    try:
        # Common locations for fonts on linux/mac
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "Arial.ttf"
        ]
        font_path = next((p for p in font_paths if os.path.exists(p)), None)
        
        if font_path:
            title_font = ImageFont.truetype(font_path, 80)
            subtitle_font = ImageFont.truetype(font_path, 40)
        else:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # Draw Text
    draw.text((80, 220), title, font=title_font, fill=(255, 255, 255))
    draw.text((80, 340), subtitle, font=subtitle_font, fill=(199, 210, 254)) # Indigo-200 ish
    
    # Draw branding at bottom
    draw.text((80, 530), "resumebp.com", font=subtitle_font, fill=(255, 255, 255, 180))

    # Save to buffer
    img_byte_arr = io.BytesIO()
    base.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()

    return Response(content=img_byte_arr, media_type="image/png")
