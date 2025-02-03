from dotenv import load_dotenv
import streamlit as st
import os
from PIL import Image
import google.generativeai as genai

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_gemini_response(image):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = "Classify this waste as Recyclable, Biodegradable, or Hazardous. Provide disposal tips."
    response = model.generate_content([image[0], prompt])
    return response.text

def input_image_setup(uploaded_file):
    if uploaded_file is not None:
        bytes_data = uploaded_file.getvalue()
        return [{"mime_type": uploaded_file.type, "data": bytes_data}]
    return None

# Streamlit UI
st.set_page_config(page_title="EcoSort AI", page_icon="🌱", layout="centered")
st.markdown("""
    <style>
        body { background-color: #e8f5e9; }
        .stButton>button { background-color: #4caf50; color: white; }
    </style>
""", unsafe_allow_html=True)

st.title("♻️ EcoSort AI - Smart Waste Classifier")
st.write("Upload an image of a waste item, and AI will classify it as Recyclable, Biodegradable, or Hazardous with proper disposal tips.")

uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])
if uploaded_file:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Waste Item", use_container_width=True)

    if st.button("Classify Waste ♻️"):
        image_data = input_image_setup(uploaded_file)
        if image_data:
            response = get_gemini_response(image_data)
            st.subheader("♻️ Classification & Tips")
            st.write(response)
        else:
            st.error("Error processing the image. Please try again.")
