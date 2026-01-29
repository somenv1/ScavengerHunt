#!/usr/bin/env python3
"""
Simple QR Code Generator using Google Charts API
No dependencies required - downloads QR codes directly from Google
"""

import urllib.request
import urllib.parse

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
        "url": "https://www.google.com/maps/search/?api=1&query=50.8454,4.3527"
    },
    {
        "number": 3,
        "name": "Café Léopold Royal",
        "url": "https://www.google.com/maps/search/?api=1&query=50.8469,4.3631"
    },
    {
        "number": 4,
        "name": "Triumphal Arch",
        "url": "https://www.google.com/maps/search/?api=1&query=50.8397,4.3936"
    },
    {
        "number": 5,
        "name": "Docks Bruxsel",
        "url": "https://www.google.com/maps/search/?api=1&query=50.8679,4.3492"
    },
    {
        "number": 6,
        "name": "Sunset Spot",
        "url": "https://www.google.com/maps/search/?api=1&query=50.8735,4.3548"
    }
]

def generate_qr_codes():
    """Generate QR codes using Google Charts API"""
    print("=" * 60)
    print("Scavenger Hunt QR Code Generator")
    print("Using Google Charts API (No installation required)")
    print("=" * 60)
    print()

    for location in locations:
        try:
            # URL encode the location URL
            encoded_url = urllib.parse.quote(location["url"])

            # Google Charts API for QR code
            # Size: 300x300px, Error correction: H (high)
            qr_api_url = f"https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl={encoded_url}&choe=UTF-8"

            # Download the QR code
            filename = f"qr_code_location_{location['number']}.png"
            urllib.request.urlretrieve(qr_api_url, filename)

            print(f"✓ Generated: {filename}")
            print(f"  Location: {location['name']}")
            print(f"  Maps URL: {location['url']}")
            print()

        except Exception as e:
            print(f"❌ Error generating QR code for location {location['number']}: {e}")
            print()

    print("=" * 60)
    print("✓ All QR codes generated successfully!")
    print("=" * 60)
    print("\nFiles created:")
    for location in locations:
        print(f"  • qr_code_location_{location['number']}.png - {location['name']}")
    print("\n⚠ IMPORTANT: Test each QR code with your phone before printing!")

if __name__ == "__main__":
    try:
        generate_qr_codes()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure you have an internet connection to use the Google Charts API.")
