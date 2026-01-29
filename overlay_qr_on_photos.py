#!/usr/bin/env python3
"""
Overlay QR codes on photos for scavenger hunt letters
Each letter shows the photo and QR from the PREVIOUS location
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Photo and QR code mapping
# Letter N gets photo from location N-1
overlays = [
    # Letter 2 gets location 1
    {
        "letter_num": 2,
        "photo": "l1.jpg",
        "qr_pink": "qr_code_location_1_pink.png",
        "qr_highres": "qr_code_location_1_highres.png",
        "output": "letter_2_photo_qr.png"
    },
    # Letter 3 gets location 2
    {
        "letter_num": 3,
        "photo": "l2.jpg",
        "qr_pink": "qr_code_location_2_pink.png",
        "qr_highres": "qr_code_location_2_highres.png",
        "output": "letter_3_photo_qr.png"
    },
    # Letter 4 gets location 3
    {
        "letter_num": 4,
        "photo": "l3.jpg",
        "qr_pink": "qr_code_location_3_pink.png",
        "qr_highres": "qr_code_location_3_highres.png",
        "output": "letter_4_photo_qr.png"
    },
    # Letter 5 gets location 4
    {
        "letter_num": 5,
        "photo": "l4.jpg",
        "qr_pink": "qr_code_location_4_pink.png",
        "qr_highres": "qr_code_location_4_highres.png",
        "output": "letter_5_photo_qr.png"
    },
    # Letter 6 gets location 5
    {
        "letter_num": 6,
        "photo": "l5.jpg",
        "qr_pink": "qr_code_location_5_pink.png",
        "qr_highres": "qr_code_location_5_highres.png",
        "output": "letter_6_photo_qr.png"
    }
]

def overlay_qr_on_photo(photo_path, qr_path, output_path, qr_size=300):
    """
    Overlay QR code on bottom right corner of photo
    """
    # Open photo
    photo = Image.open(photo_path)
    photo_width, photo_height = photo.size

    # Open QR code
    qr = Image.open(qr_path)

    # Resize QR code to desired size (keeping aspect ratio)
    qr_aspect = qr.width / qr.height
    qr_resized = qr.resize((qr_size, int(qr_size / qr_aspect)), Image.Resampling.LANCZOS)

    # Create a new image with a white border around QR code for better visibility
    border = 10
    qr_with_border = Image.new('RGB',
                                (qr_resized.width + border * 2,
                                 qr_resized.height + border * 2),
                                'white')
    qr_with_border.paste(qr_resized, (border, border))

    # Add a pink border around the white border
    draw = ImageDraw.Draw(qr_with_border)
    draw.rectangle(
        [(0, 0), (qr_with_border.width - 1, qr_with_border.height - 1)],
        outline='#e8728a',
        width=3
    )

    # Calculate position (bottom right with some padding)
    padding = 20
    x = photo_width - qr_with_border.width - padding
    y = photo_height - qr_with_border.height - padding

    # Create a copy of the photo and paste QR code
    result = photo.copy()
    result.paste(qr_with_border, (x, y))

    # Save result
    result.save(output_path, quality=95, dpi=(300, 300))

    return output_path

def main():
    print("=" * 60)
    print("Overlaying QR Codes on Photos")
    print("=" * 60)
    print()

    for item in overlays:
        print(f"Processing Letter {item['letter_num']}...")

        # Check if files exist
        if not os.path.exists(item['photo']):
            print(f"  ⚠ Photo not found: {item['photo']}")
            continue

        if not os.path.exists(item['qr_pink']):
            print(f"  ⚠ QR code not found: {item['qr_pink']}")
            continue

        try:
            # Use pink QR code for the overlay
            output = overlay_qr_on_photo(
                item['photo'],
                item['qr_pink'],
                item['output'],
                qr_size=280  # Size of QR code in pixels
            )
            print(f"  ✓ Created: {output}")
            print(f"    From photo: {item['photo']}")
            print(f"    With QR: {item['qr_pink']}")
        except Exception as e:
            print(f"  ❌ Error: {e}")

        print()

    print("=" * 60)
    print("✓ All overlays complete!")
    print("=" * 60)
    print("\nGenerated files:")
    for item in overlays:
        if os.path.exists(item['output']):
            print(f"  • {item['output']} (for Letter {item['letter_num']})")
    print("\nNote: Letter 1 has no photo/QR (it's the starting point)")

if __name__ == "__main__":
    main()
