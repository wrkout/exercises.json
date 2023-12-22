import os
import json
import re
import openai

# OpenAI API key setup
openai.api_key = 'your-api-key'

def clean_text(text):
    # Remove special characters
    return re.sub(r"[^a-zA-Z0-9\s'.,/():-]", '', text)

def get_corrected_sentence(sentence):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # or the latest available model
            prompt=f"Rewrite this sentence without special characters: {sentence}",
            max_tokens=60
        )
        return clean_text(response.choices[0].text.strip())
    except Exception as e:
        print("Error in OpenAI API call:", e)
        return None

def print_subfolders(directory):
  for folder_name in os.listdir(directory):
    # for name in dirs: 
    print(folder_name)
      

# Set your exercises directory path
def main():
    print_subfolders('exercises')

if __name__ == "__main__":
    main()
