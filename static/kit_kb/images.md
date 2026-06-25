# Imagination Station (Images) — local image generation

Generate images locally on your own graphics card — free and unlimited. Deep
how-to below.

## What Imagination Station is
A local AI image generator. It runs on your own GPU, so it's free and unlimited —
no per-image cost and nothing leaves your machine. You pick a mode, describe the
picture, and it renders into a gallery.

## The modes
Pick a mode up top:
- **DRAFT** — fast, for quickly trying ideas and compositions.
- **PHOTO** — most realistic, slowest; use it for the final, photoreal result.
- **Z-IMAGE** — an alternate generation model/style.
- **EDIT** — change or refine an existing image rather than making a new one.
Start in DRAFT to nail the idea, then switch to PHOTO for the keeper.

## Writing a good prompt
Describe the picture specifically: the subject, the lighting, the place/setting,
the mood, and what the camera sees (angle, lens, framing). Specific beats vague —
"golden-hour side light, 85mm portrait, shallow depth of field" gets a better
result than "nice photo." The more concrete the scene, the better the render.

## Polish (prompt rewrite)
The "Polish" button rewrites your prompt into a richer, more detailed version
before generating. Use it when you have a rough idea and want the model to flesh
out the description. You can still edit the polished prompt before hitting
generate.

## Aspect ratio and size
Set the aspect ratio / output size up top before you generate (e.g. square,
portrait, landscape). Match it to where the image will be used.

## Generating
Hit the generate button (bottom right) to render. The first image after a cold
start takes a minute or two while the engine wakes up and loads onto the GPU;
after that, images come quickly. Finished images drop into the gallery below.

## Managing VRAM (free memory)
Image generation and the chat brain both want graphics-card memory. If things get
heavy or slow, use "free memory" to clear the image engine out of VRAM. That frees
the card (for example so the chat brain has room), at the cost of a cold start next
time you generate.

## Tips
- Cold first render is normal — give the first image a minute, then it's fast.
- DRAFT to explore, PHOTO for the final.
- Be specific about light and camera for realism.
- Use EDIT mode to refine an image instead of starting over.

## The first image is taking forever
That's the cold start — the first render after opening (or after freeing memory)
has to wake the engine and load it onto your graphics card, which takes a minute or
two. Every image after that is quick. If you just hit "free memory," the next
render is a cold start again.

## My images don't look realistic / look bad
Switch to PHOTO mode (it's the most realistic, just slower than DRAFT). Then make
the prompt more specific — describe the light (e.g. soft window light, golden
hour), the camera (angle, lens, depth of field), the setting, and the mood. Vague
prompts give vague images. Use the Polish button to flesh out a rough prompt.

## The room is slow or running out of memory
Image generation and the chat brain share your graphics card's memory. If it's
heavy or stalling, hit "free memory" to clear the image engine out of VRAM. That
frees the card (so, for example, the chat brain has room) — the trade-off is the
next image will be a cold start.

## How do I change an existing image instead of making a new one
Use EDIT mode (pick it from the modes up top). That refines or changes the image
you have rather than generating from scratch.
