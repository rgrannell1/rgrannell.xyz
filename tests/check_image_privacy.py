#!/usr/bin/env python3
"""Fail if any git-tracked image carries GPS or other identifying EXIF metadata."""

import io
import subprocess
import sys

from PIL import Image

# EXIF IFD tag for the GPS sub-directory
GPS_IFD_TAG = 0x8825
# top-level EXIF tags that identify a person or device
IDENTIFYING_TAGS = {
    0x010F: "Make",
    0x0110: "Model",
    0x013B: "Artist",
    0x8298: "Copyright",
    0xC4A5: "HostComputer",
}
# image extensions worth scanning
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff")


def list_tracked_images():
    output = subprocess.run(
        ["git", "ls-files"], capture_output=True, text=True, check=True
    ).stdout
    return [line for line in output.splitlines() if line.lower().endswith(IMAGE_EXTENSIONS)]


def find_leaks(path):
    with open(path, "rb") as handle:
        data = handle.read()

    try:
        exif = Image.open(io.BytesIO(data)).getexif()
    except Exception as err:
        return [f"unreadable image ({err})"]

    if not exif:
        return []

    leaks = []
    if exif.get_ifd(GPS_IFD_TAG):
        leaks.append("GPS coordinates")
    for tag_id, name in IDENTIFYING_TAGS.items():
        if exif.get(tag_id):
            leaks.append(name)
    return leaks


def main():
    failures = []
    for path in list_tracked_images():
        leaks = find_leaks(path)
        if leaks:
            failures.append(f"{path}: {', '.join(leaks)}")

    if failures:
        print("images with identifying metadata:", file=sys.stderr)
        for failure in failures:
            print(f"  {failure}", file=sys.stderr)
        sys.exit(1)

    print("ok: no tracked image carries identifying metadata")


if __name__ == "__main__":
    main()
