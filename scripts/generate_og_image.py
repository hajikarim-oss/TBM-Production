import os
from PIL import Image, ImageDraw, ImageFont

def create_og_image():
    width = 1200
    height = 630
    
    # Create dark cinematic background
    img = Image.new("RGBA", (width, height), (10, 10, 10, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw subtle gradient/glow circles in the background
    for r in range(400, 0, -10):
        alpha = int(18 * (1 - r / 400))
        draw.ellipse([800 - r, 150 - r, 800 + r, 150 + r], fill=(225, 77, 42, alpha))
        
    for r in range(350, 0, -10):
        alpha = int(12 * (1 - r / 350))
        draw.ellipse([250 - r, 450 - r, 250 + r, 450 + r], fill=(40, 60, 120, alpha))
    
    # Subtle border outline
    draw.rectangle([20, 20, width - 20, height - 20], outline=(40, 40, 40, 255), width=1)
    
    # Try loading Arial or standard Windows fonts
    font_bold_path = "C:/Windows/Fonts/arialbd.ttf"
    font_reg_path = "C:/Windows/Fonts/arial.ttf"
    font_cond_path = "C:/Windows/Fonts/segoeuib.ttf"
    
    try:
        title_font = ImageFont.truetype(font_cond_path, 64)
        subtitle_font = ImageFont.truetype(font_bold_path, 32)
        tagline_font = ImageFont.truetype(font_reg_path, 22)
        url_font = ImageFont.truetype(font_bold_path, 20)
        badge_font = ImageFont.truetype(font_bold_path, 16)
    except Exception:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        tagline_font = ImageFont.load_default()
        url_font = ImageFont.load_default()
        badge_font = ImageFont.load_default()

    # Load TBM logo if available
    logo_path = "artifacts/videofolio/public/tbm-logo.png"
    if os.path.exists(logo_path):
        tbm_logo = Image.open(logo_path).convert("RGBA")
        # Resize maintaining aspect ratio
        orig_w, orig_h = tbm_logo.size
        target_w = 260
        target_h = int(orig_h * (target_w / orig_w))
        tbm_logo = tbm_logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
        img.paste(tbm_logo, (80, 80), tbm_logo)
    
    # Category badge
    badge_text = "PRODUCTION & POST-PRODUCTION PIPELINE"
    badge_x, badge_y = 80, 185
    draw.rounded_rectangle([badge_x, badge_y, badge_x + 440, badge_y + 36], radius=8, fill=(28, 28, 28, 255), outline=(60, 60, 60, 255), width=1)
    draw.text((badge_x + 18, badge_y + 9), badge_text, fill=(225, 77, 42, 255), font=badge_font)

    # Main Headline
    draw.text((80, 245), "THE BORED MONKEY", fill=(255, 255, 255, 255), font=title_font)
    draw.text((80, 320), "STUDIO", fill=(225, 77, 42, 255), font=title_font)
    
    # Subtitle
    draw.text((80, 415), "Cinematic Commercials  •  DVCs  •  Brand Films", fill=(220, 220, 220, 255), font=subtitle_font)
    
    # Descriptive line
    draw.text((80, 470), "Full in-house pipeline: Concept, Direction, Production, VFX, Grade & Sound", fill=(140, 140, 140, 255), font=tagline_font)
    
    # Bottom bar separator
    draw.line([80, 525, width - 80, 525], fill=(45, 45, 45, 255), width=1)
    
    # Bottom metadata
    draw.text((80, 550), "theboredmonkey.com/studio", fill=(255, 255, 255, 255), font=url_font)
    draw.text((width - 320, 550), "Mumbai  •  Global Inquiries", fill=(120, 120, 120, 255), font=url_font)
    
    # Save target directories
    os.makedirs("artifacts/videofolio/public/assets", exist_ok=True)
    
    # Convert RGBA to RGB for optimized PNG
    final_img = img.convert("RGB")
    final_img.save("artifacts/videofolio/public/assets/og-studio.png", "PNG", optimize=True)
    final_img.save("artifacts/videofolio/public/og-studio.png", "PNG", optimize=True)
    print("OG images created successfully at:")
    print(" - artifacts/videofolio/public/assets/og-studio.png")
    print(" - artifacts/videofolio/public/og-studio.png")

if __name__ == "__main__":
    create_og_image()
