import torch
import cv2
import numpy as np
from torchvision import transforms

from app.model.load_model import model, DEVICE
from app.utils.image import preprocess, generate_heatmap

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

def run_inference(image_bytes: bytes):
    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    tensor, (h, w) = preprocess(img, transform)
    tensor = tensor.to(DEVICE)

    with torch.no_grad():
        pred = model(tensor)

    count = float(pred.sum().item())
    heatmap = generate_heatmap(pred, (h, w), img)

    return {
        "count": count,
        "heatmap": heatmap
    }