## stable-diffusion-webui-images-browser

A custom extension for [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui).

This is an image browser for browsing past generated pictures, view their generated informations, send that information to txt2img, img2img and others, collect images to your "favorites" folder and delete the images you no longer need.

## Installation

The extension can be installed directly from within the **Extensions** tab within the Webui.

You can also install it manually by running the following command from within the webui directory:

	git clone https://github.com/AlUlkesh/stable-diffusion-webui-images-browser/ extensions/stable-diffusion-webui-images-browser

and restart your stable-diffusion-webui, then you can see the new tab "Image Browser".

Please be aware that when scanning a directory for the first time, the png-cache will be built. This can take several minutes, depending on the amount of images.

## Recent updates
- "All"-tab showing all the images from all tabs combined
- Size tooltip for thumbnails
- Optimized images in the thumbnail interface
- Send to ControlNet
- Hidable UI components
- Send to openOutpaint
- Regex search
- Maximum aesthetic_score filter
- Save ranking to EXIF option
- Maintenance tab
- Custom tabs
- Copy/Move to directory
- Keybindings
- Additional sorting and filtering by EXIF data including .txt file information
- Recyle bin option
- Add/Remove from saved directories, via buttons
- New dropdown with subdirs
- Option to not show the images from subdirs
- Refresh button
- Sort order
- View and save favorites with individual folder depth
- Now also supports jpg

Please also check the [discussions](https://github.com/AlUlkesh/stable-diffusion-webui-images-browser/discussions) for major update information.

## Keybindings
| Key | Explanation |
|---------|-------------|
| `0-5` | Ranks the current image, with 0 being the last option (None) |
| `F` | Adds the current image to Favorites |
| `R` | Refreshes the image gallery |
| `Delete` | Deletes the current image |
| `Ctrl + Arrow Left` | Goes to the previous page of images |
| `Ctrl + Arrow Right` | Goes to the next page of images |

(Ctrl can be changed in settings)

## Credit

Credit goes to the original maintainer of this extension: https://github.com/yfszzx and to major contributors https://github.com/Klace and https://github.com/EllangoK

Image Reward: https://github.com/THUDM/ImageReward
