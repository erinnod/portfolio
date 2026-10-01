# Edge sharpness of a text crop: mean of the top 2% gradient magnitudes (crisp glyph edges are steep; upscaled bitmaps are soft).
import sys
from PIL import Image, ImageFilter
im = Image.open(sys.argv[1]).convert("L")
px = list(im.filter(ImageFilter.FIND_EDGES).getdata())
px.sort(reverse=True)
top = px[: max(1, len(px) // 50)]
print(f"{sys.argv[1]} size={im.size} sharpness={sum(top)/len(top):.1f}")
