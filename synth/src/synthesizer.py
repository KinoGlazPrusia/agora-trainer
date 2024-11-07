import torch
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer
import soundfile as sf
import argparse
import json
import os

# Define the command-line arguments
parser = argparse.ArgumentParser()
parser.add_argument("--script_path", type=str, default="")
parser.add_argument("--output_path", type=str, default="")
args = parser.parse_args()
kwargs = vars(args)

# Fetch the script data
with open(kwargs["script_path"], "r", encoding='utf-8') as file:
    script_data = json.load(file)

script_name = script_data['name'].lower().replace(' ', '_')
script_steps = script_data['steps']

# Extract the data and store it in a dictionary
data = {}
for index, step in enumerate(script_steps):
    path = kwargs['output_path'] + script_name + '_voiceover_' + str(index) + '.wav'
    content = step['voiceover']
    
    data[path] = content
    print(path, ':', content)

# Setup recorder (make it after data extraction to avoid waiting if there's errors)
device = "cuda:0" if torch.cuda.is_available() else "cpu"
model = ParlerTTSForConditionalGeneration.from_pretrained("parler-tts/parler-tts-mini-v1").to(device)
tokenizer = AutoTokenizer.from_pretrained("parler-tts/parler-tts-mini-v1")
description = "A female speaker delivers a slightly expressive and animated speech with fiendly and educational tone. She's a teacher."

# Iterate the dictionary and generate the audio
for path, text in data.items():
    if text == '': continue
    prompt = text
    input_ids = tokenizer(description, return_tensors="pt").input_ids.to(device)
    prompt_input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to(device)

    generation = model.generate(input_ids=input_ids, prompt_input_ids=prompt_input_ids)
    audio_arr = generation.cpu().numpy().squeeze()
    sf.write(path, audio_arr, model.config.sampling_rate)


# Usage: python .\src\synthesizer.py --script_path="../public/assets/scripts/Unite!/delete_course.json" --output_path="./"

