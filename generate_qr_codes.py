#!/usr/bin/env python3
"""
QR Code Generator for Scavenger Hunt
Generates QR codes that link to Google Maps locations
"""

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask

# Location data with Google Maps URLs
locations = [
    {
        "number": 1,
        "name": "Park in Jette",
        "url": "https://www.google.com/maps/search/?api=1&query=50.8823446,4.3297479"
    },
    {
        "number": 2,
        "name": "Mykonos Pitta Gyros",
        "url": "https://www.google.com/maps/search/?api=1&query=50.84585,4.35291"
    },
    {
        "number": 3,
        "name": "Café Léopold Royal",
        "url": "https://www.google.com/maps/search/?api=1&query=50.847691,4.363278"
    },
    {
        "number": 4,
        "name": "Triumphal Arch",
        "url": "https://www.google.com/maps/search/?api=1&query=50.8405527,4.3929939"
    },
    {
        "number": 5,
        "name": "Docks Bruxsel",
        "url": "https://www.google.com/maps/search/?api=1&query=50.87984,4.37348"
    },
    {
        "number": 6,
        "name": "Sunset Spot",
        "url": "https://www.google.com/maps/search/?api=1&query=50.880531,4.383858"
    }
]

def generate_basic_qr_codes():
    """Generate basic black and white QR codes"""
    print("Generating basic QR codes...")

    for location in locations:
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction for reliability
            box_size=10,
            border=4,
        )

        # Add data
        qr.add_data(location["url"])
        qr.make(fit=True)

        # Create image
        img = qr.make_image(fill_color="black", back_color="white")

        # Save
        filename = f"qr_code_location_{location['number']}.png"
        img.save(filename)
        print(f"✓ Generated: {filename} - {location['name']}")

def generate_styled_qr_codes():
    """Generate styled QR codes with pink theme (requires pillow)"""
    print("\nGenerating styled pink QR codes...")

    try:
        for location in locations:
            # Create QR code instance
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=10,
                border=4,
            )

            # Add data
            qr.add_data(location["url"])
            qr.make(fit=True)

            # Create styled image with pink color
            img = qr.make_image(
                image_factory=StyledPilImage,
                module_drawer=RoundedModuleDrawer(),
                color_mask=SolidFillColorMask(
                    back_color=(255, 245, 247),  # Light pink background
                    front_color=(232, 114, 138)   # Pink primary color
                )
            )

            # Save
            filename = f"qr_code_location_{location['number']}_pink.png"
            img.save(filename)
            print(f"✓ Generated: {filename} - {location['name']}")

    except Exception as e:
        print(f"⚠ Could not generate styled QR codes: {e}")
        print("  (This is optional - basic QR codes work perfectly!)")

def generate_high_res_qr_codes():
    """Generate high-resolution QR codes for printing"""
    print("\nGenerating high-resolution QR codes for printing...")

    for location in locations:
        # Create QR code with larger box size for high resolution
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=20,  # Larger for high-res printing
            border=4,
        )

        # Add data
        qr.add_data(location["url"])
        qr.make(fit=True)

        # Create image
        img = qr.make_image(fill_color="black", back_color="white")

        # Save
        filename = f"qr_code_location_{location['number']}_highres.png"
        img.save(filename)
        print(f"✓ Generated: {filename} - {location['name']}")

if __name__ == "__main__":
    print("=" * 60)
    print("Scavenger Hunt QR Code Generator")
    print("=" * 60)

    try:
        # Generate basic QR codes (always works)
        generate_basic_qr_codes()

        # Generate high-res versions for printing
        generate_high_res_qr_codes()

        # Try to generate styled versions (optional)
        generate_styled_qr_codes()

        print("\n" + "=" * 60)
        print("✓ All QR codes generated successfully!")
        print("=" * 60)
        print("\nFiles created:")
        print("  • qr_code_location_X.png - Standard QR codes")
        print("  • qr_code_location_X_highres.png - High-res for printing")
        print("  • qr_code_location_X_pink.png - Styled pink QR codes (if available)")
        print("\nTest each QR code with your phone camera before printing!")

    except ImportError:
        print("\n" + "!" * 60)
        print("ERROR: qrcode library not installed")
        print("!" * 60)
        print("\nPlease install it by running:")
        print("  pip install qrcode[pil]")
        print("\nThen run this script again.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
