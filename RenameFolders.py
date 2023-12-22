import os

def rename_folders(directory):
    for folder_name in os.listdir(directory):
        folder_path = os.path.join(directory, folder_name)
        if os.path.isdir(folder_path):
            # Replace parentheses with underscore
            new_name = folder_name.replace("(", "_").replace(")", "")
            # Replace '_-_' with '_'
            new_name = new_name.replace("_-_", "_")
            new_folder_path = os.path.join(directory, new_name)
            os.rename(folder_path, new_folder_path)
            print(f"Renamed '{folder_name}' to '{new_name}'")

# Replace '/path/to/directory' with the path of your directory
directory_path = 'exercises/'
rename_folders(directory_path)
