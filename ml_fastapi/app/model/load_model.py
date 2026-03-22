import torch
from app.model.csrnet import CSRNet

MODEL_PATH = "checkpoints/csrnet_checkpoint.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = CSRNet().to(DEVICE)

checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
model.load_state_dict(checkpoint["model_state"])

model.eval()