import cv2
import numpy as np
import base64

IMG_SIZE = (384, 640)

def preprocess(img, transform):
    h, w, _ = img.shape
    resized = cv2.resize(img, (IMG_SIZE[1], IMG_SIZE[0]))
    tensor = transform(resized).unsqueeze(0)
    return tensor, (h, w)

def generate_heatmap(pred, original_shape, original_img):
    h, w = original_shape

    density = pred.squeeze().cpu().numpy()
    density = density / (density.max() + 1e-8)
    density = cv2.resize(density, (w, h))

    heatmap = cv2.applyColorMap(
        np.uint8(255 * density), cv2.COLORMAP_JET
    )
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    overlay = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)

    _, buffer = cv2.imencode(".jpg", overlay)
    return base64.b64encode(buffer).decode()