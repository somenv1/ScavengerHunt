#!/usr/bin/env python3
"""
Generate QR code for the scavenger hunt website
"""

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask

# Website URL
website_url = "https://chirayu18.github.io/ScavengerHunt/"

def generate_website_qr():
    """Generate QR code for the website"""
    print("=" * 60)
    print("Generating Website QR Code")
    print("=" * 60)
    print()

    # Basic version
    print("Generating basic QR code...")
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(website_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save("qr_code_website.png")
    print(f"✓ Generated: qr_code_website.png")

    # High-res version
    print("\nGenerating high-resolution QR code...")
    qr_highres = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=4,
    )
    qr_highres.add_data(website_url)
    qr_highres.make(fit=True)

    img_highres = qr_highres.make_image(fill_color="black", back_color="white")
    img_highres.save("qr_code_website_highres.png")
    print(f"✓ Generated: qr_code_website_highres.png")

    # Pink styled version
    print("\nGenerating pink styled QR code...")
    try:
        qr_pink = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr_pink.add_data(website_url)
        qr_pink.make(fit=True)

        img_pink = qr_pink.make_image(
            image_factory=StyledPilImage,
            module_drawer=RoundedModuleDrawer(),
            color_mask=SolidFillColorMask(
                back_color=(255, 245, 247),  # Light pink background
                front_color=(232, 114, 138)   # Pink primary color
            )
        )
        img_pink.save("qr_code_website_pink.png")
        print(f"✓ Generated: qr_code_website_pink.png")
    except Exception as e:
        print(f"⚠ Could not generate styled QR code: {e}")

    print("\n" + "=" * 60)
    print("✓ Website QR codes generated!")
    print("=" * 60)
    print(f"\nWebsite URL: {website_url}")
    print("\nGenerated files:")
    print("  • qr_code_website.png - Standard")
    print("  • qr_code_website_highres.png - High-res for printing")
    print("  • qr_code_website_pink.png - Pink styled")

if __name__ == "__main__":
    generate_website_qr()
