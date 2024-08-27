## Introduction

### Overview

This documentation provides a comprehensive guide to the inner workings of a simplified, Capcut-inspired video editor built using React, Fabric.js, and FFMPEG.wasm. Our editor empowers users to piece together video clips, images, audio, and text, apply visual effects and animations, and ultimately export their creations as a cohesive video.

### Target Audience

This documentation is geared towards developers with a solid grasp of React and front-end web development concepts. Familiarity with HTML5 canvas and basic video editing principles will be beneficial.

### Key Features

- **Timeline-based Editing:**  Arrange media and elements on a visual timeline to dictate their sequence and duration.
- **Multimedia Support:**  Incorporate video clips, images, audio tracks, and text elements into your projects.
- **Visual Effects and Filters:**  Enhance your media with a variety of visual effects (e.g., black and white, sepia) to achieve a desired style.
- **Animations:**  Bring your edits to life by adding animations like fade-in, fade-out, slide-in, and slide-out to your elements.
- **Custom Cropping:**  Fine-tune the framing of your video and image content with a user-friendly cropping tool.
- **Export to Video:**  Generate a final video output incorporating all edits, effects, and animations.

## 2. Getting Started

This section guides you through setting up the Fabric Video Editor on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js and npm:** The project relies on Node.js for its JavaScript runtime environment and npm (Node Package Manager) for handling dependencies. Download and install the appropriate versions for your operating system from [https://nodejs.org/](https://nodejs.org/).
- **Git:**  We'll be cloning the project repository from GitHub, so having Git installed is essential. Download and install it from [https://git-scm.com/](https://git-scm.com/).

### Installation

1. **Clone the Repository:**
   - Open your terminal or command prompt.
   - Navigate to the directory where you want to clone the project.
   - Execute the following command: 
     ```bash
     git clone https://github.com/your-username/fabric-video-editor.git 
     ```
   - **Note:** Replace `your-username/fabric-video-editor.git` with the actual GitHub repository URL you get from Christophe.

2. **Navigate to the Project Directory:**
   ```bash
   cd fabric-video-editor 
   ```

3. **Install Dependencies:**
   ```bash
   npm install 
   ```
   This command reads the `package.json` file and installs all the necessary project dependencies.

### Running the Development Server

Once installation is complete:

1. **Start the Server:**
   ```bash
   npm run dev
   ```

2. **Access in Browser:**
   - Open your web browser and go to [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal output).  You should see the Fabric Video Editor interface.

### Debugging

Visual Studio Code (VS Code) offers a convenient debugging setup:

1. **Run Development Server:** Ensure the server is running with `npm run dev`.

2. **VS Code Debugger:**
   - In VS Code, navigate to the "Run and Debug" tab (usually accessed by clicking the bug icon in the left sidebar).
   - Click "Run and Debug" and select "Launch Chrome against localhost" (or your preferred browser). 

   This will launch a new browser window attached to the VS Code debugger, allowing you to set breakpoints and inspect your code during runtime.

## 3. Core Concepts

This section introduces the fundamental concepts behind the Fabric Video Editor, providing a clear understanding of how media elements are managed, manipulated, and presented within the editor.

### 3.1 Editor Elements: The Building Blocks of Your Video

At its core, the editor revolves around the concept of **Editor Elements**. These elements represent the individual media components that constitute your video project. There are four main types:

- **Video Elements (`VideoEditorElement`)**: These elements encapsulate video clips, handling properties like the video source (`src`), current playback position, visual effects applied, and custom crop boundaries.

- **Image Elements (`ImageEditorElement`)**:  Image elements represent static images, storing the image source (`src`) and any applied visual effects.

- **Audio Elements (`AudioEditorElement`)**: Audio elements handle audio tracks, storing the audio source (`src`) and controlling playback.

- **Text Elements (`TextEditorElement`)**:  Text elements allow you to overlay text on the video. They manage properties like the text content, font size, font weight, and positioning.

Each editor element, regardless of its type, shares a common set of properties that govern its behavior and appearance within the editor:

- **`id` (Readonly, `string`)**: A unique identifier generated for each element.
- **`fabricObject` (Optional, `fabric.Object`)**: A reference to the corresponding Fabric.js object representing this element on the canvas.  This enables visual manipulation.
- **`name` (`string`)**: A user-friendly name for the element, making it identifiable in the editor interface.
- **`type` (Readonly, `string`)**: Specifies the type of the element ("video", "image", "audio", or "text").
- **`placement` (`Placement`)**:  Controls the element's positioning, size, rotation, and scaling on the canvas. (See Section 3.3 for more on `Placement`)
- **`timeFrame` (`TimeFrame`)**:  Defines the element's start and end times on the timeline.  (See Section 3.2 for details on `TimeFrame`)
- **`elementCurrentTime` (`number`)**:  Tracks the current playback time (in milliseconds) within the element's media.
- **`properties` (Type varies)**:  Holds element-specific properties (e.g., `src` for video/image/audio, `text` for text elements).

### 3.2 Timeline and TimeFrame: Orchestrating Your Video's Sequence

The **Timeline** is the heart of the video editor, providing a visual representation of your video's structure over time. It dictates when each element appears, disappears, and how long it lasts.

Central to the timeline's functionality is the concept of a **TimeFrame**, represented by the `TimeFrame` type:

- **`start` (`number`)**:  The point in time (in milliseconds) on the timeline when the element should start being visible or audible.
- **`end` (`number`)**:  The time (in milliseconds) on the timeline when the element should end.
- **`relativeStart` (`number`)**:  For video and audio elements, this stores the starting point (in milliseconds) within the original media from where playback should commence. Useful when you only want to include a portion of a longer video or audio file.

The `start` and `end` properties determine an element's duration on the timeline. `relativeStart` offers more fine-grained control over media playback.

The timeline's visual representation allows you to:

- **Drag elements** to change their position in the sequence.
- **Resize elements** to modify their duration.
- **Split elements** to cut them into multiple segments.

### 3.3 Placement and Manipulation: Positioning Elements on the Canvas

The `Placement` type dictates how editor elements are spatially arranged and manipulated on the Fabric.js canvas.  It encompasses the following properties:

- **`x` (`number`)**:  The x-coordinate of the element's top-left corner on the canvas.
- **`y` (`number`)**:  The y-coordinate of the element's top-left corner on the canvas.
- **`width` (`number`)**: The display width of the element on the canvas.
- **`height` (`number`)**: The display height of the element on the canvas.
- **`cropX` (Optional, `number`)**: For custom cropping, the x-coordinate of the crop area's top-left corner relative to the element.
- **`cropY` (Optional, `number`)**: For custom cropping, the y-coordinate of the crop area's top-left corner relative to the element.
- **`cropWidth` (Optional, `number`)**: The width of the custom crop area.
- **`cropHeight` (Optional, `number`)**: The height of the custom crop area.
- **`rotation` (`number`)**: The angle (in degrees) by which the element is rotated.
- **`scaleX` (`number`)**: The horizontal scaling factor of the element (1 represents the original width).
- **`scaleY` (`number`)**: The vertical scaling factor of the element (1 represents the original height).

By modifying these properties, you can precisely position, resize, rotate, crop, and scale elements on the canvas to achieve your desired visual layout.

This detailed exploration of core concepts provides a foundation for understanding the structure and functionality of the Fabric Video Editor. 

## 4. Component Breakdown

This section dives into the key components that make up the Fabric Video Editor, explaining their roles, functionalities, and interactions within the application.

### 4.1 Store.ts (MobX Store): The Single Source of Truth

The `Store.ts` file houses the MobX store, which acts as the central data repository and logic hub for the entire application. Its properties hold the editor's state, and its methods provide ways to update and manipulate this state.  

Let's break down the key parts of `Store.ts`:

**Properties:**

- **`canvas` (`fabric.Canvas | null`)**:  A reference to the Fabric.js canvas instance, providing access to canvas manipulation methods. 
- **`backgroundColor` (`string`)**:  Stores the background color of the canvas.
- **`selectedMenuOption` (`MenuOption`)**:  Tracks the currently selected menu option ("Video", "Audio", "Text", etc.), influencing which resource panel is displayed.
- **`audios` (`string[]`)**: An array of URLs pointing to loaded audio resources.
- **`videos` (`string[]`)**:  An array of URLs representing loaded video resources.
- **`images` (`string[]`)**:  An array of URLs pointing to loaded image resources.
- **`editorElements` (`EditorElement[]`)**:  The heart of the editor!  This array stores all the editor elements (video, image, audio, text) that have been added to the timeline.
- **`selectedElement` (`EditorElement | null`)**: Holds a reference to the currently selected editor element, allowing for focused manipulation.
- **`maxTime` (`number`)**:  The maximum duration (in milliseconds) of the timeline.
- **`animations` (`Animation[]`)**:  An array to store animations applied to editor elements.
- **`animationTimeLine` (`anime.AnimeTimelineInstance`)**: An instance of Anime.js timeline to manage and play animations.
- **`playing` (`boolean`)**:  Indicates whether the editor's playback is active or paused.
- **`currentKeyFrame` (`number`)**: Represents the current frame of the timeline during playback, used to synchronize elements and animations.
- **`fps` (`number`)**:  The frames per second for playback.
- **`canvasInitialized` (`boolean`)**:  A flag indicating if the Fabric.js canvas has been initialized.

**Methods:**

- **`setSelectedMenuOption(selectedMenuOption: MenuOption)`**:  Updates the `selectedMenuOption` property, controlling which resource panel is shown.
- **`setCanvas(canvas: fabric.Canvas | null)`**:  Sets the `canvas` property once the Fabric.js canvas is initialized.
- **`setBackgroundColor(backgroundColor: string)`**:  Changes the canvas's background color.
- **`addVideoResource, addAudioResource, addImageResource`**: Methods to add resources to the respective arrays.
- **`addEditorElement(editorElement: EditorElement)`**: Adds a new editor element (video, audio, image, or text) to the `editorElements` array, effectively adding it to the timeline.
- **`removeEditorElement(id: string)`**:  Deletes an editor element from the timeline.
- **`updateEditorElement(editorElement: EditorElement)`**:  Updates the properties of an existing editor element.
- **`setPlaying(playing: boolean)`**: Starts or stops the editor's playback loop.
- **`updateTimeTo(newTime: number)`**:  Seeks the timeline to a specific time, updating element visibility and playback positions.
- **`refreshElements()`**: A crucial method that re-renders and updates the elements on the Fabric.js canvas whenever there are changes in the `editorElements` array.
- **`splitElement(id: string, splitTime: number)`**:  Splits an existing element into two at the specified `splitTime`.
- **`saveCanvasToVideoWithAudio()`**:  Handles the export process, capturing the canvas content along with audio and generating the final video output.

### 4.2 Key UI Components: The User Interface

- **`Editor.tsx`**:  The root component that initializes the Fabric.js canvas, sets up event listeners, and renders other components like `Resources`, `ElementsPanel`, `Menu`, `TimeLine`, and `ContextMenu`. It acts as the main container for the editor's interface.

- **`TimeLine.tsx`**: This component is responsible for visually representing the timeline, including the positions and durations of editor elements. It handles user interactions like dragging elements to change their order, resizing elements to modify their durations, and splitting elements at specific points in time.

- **`Resources.tsx`**:  Dynamically renders different resource panels based on the `selectedMenuOption` from the MobX store. 

- **`Element.tsx`**:  Represents an individual editor element within the `ElementsPanel`. It displays a preview of the element (e.g., a thumbnail for videos and images, an icon for audio and text) along with its name. Users can select elements here to manipulate them on the timeline.

### 4.3 Utility Functions: Helpers and Abstractions

- **`fabric-utils.ts`**: Contains custom Fabric.js classes and utility functions that extend the library's core functionality. For instance, it might include custom classes for handling video and image elements (`CoverVideo` and `CoverImage`) with added features like custom cropping and effects. 

Understanding this component breakdown is essential for navigating the codebase and comprehending how different parts of the application collaborate to create a functional video editor.


## 5. Custom Cropping

The Fabric Video Editor provides a mechanism for custom cropping of video and image elements, giving users precise control over the visible portion of their media. This functionality is primarily implemented through a combination of the `ReframeModal` component and custom properties within `EditorElement` and `Placement` types, along with utility functions in `fabric-utils.ts`.

### 5.1 The Mechanism: From User Interaction to Canvas Update

Here’s a step-by-step breakdown of how custom cropping works:

1. **Triggering the `ReframeModal`:** 
   - The user can initiate cropping by interacting with a designated UI element, likely within the `Element.tsx` component or a dedicated "Crop" button/option associated with the selected element.
   - This interaction will typically update a state variable within a component (e.g., `Editor.tsx`) to control the visibility of the `ReframeModal`.

2. **`ReframeModal` (`ReframeModal.tsx`):**
   - This modal component provides the cropping interface. It receives the selected `EditorElement` (`element`) as a prop.
   - Inside the modal:
     - The `ReactCrop` component is used to visually select a crop area on the media preview.
     - The user can choose a fixed aspect ratio for the crop (e.g., 16:9, 9:16).
     - For videos, there is an option to "Auto Crop" using a face-tracking API.

3. **Applying the Crop (Updating `EditorElement` and `Placement`):**
   - When the user is satisfied with their selection and clicks "Apply," the `handleApplyReframe` function within `ReframeModal` is executed.
   - This function does the following:
     - Calculates the crop boundaries relative to the original media dimensions using `calculatePixelCrop`.
     - Updates the `placement` property of the selected `EditorElement`:
       - `cropX`, `cropY`, `cropWidth`, and `cropHeight` are set within the `Placement` object to store the crop coordinates and dimensions.
       - The element’s `width` and `height` might also be adjusted based on the crop and canvas dimensions to ensure proper display.
   - The modal closes, and the changes to the `EditorElement`'s `placement` trigger a re-render.

4. **Canvas Update (`refreshElements`):**
   - The changes in the `EditorElement` are reflected in the MobX store, triggering an update to the canvas through the `refreshElements` method in `Store.ts`.
   - **`fabric-utils.ts` (`CoverImage`/`CoverVideo`):**
     -  These custom Fabric.js classes (if implemented as described in the previous section) are crucial for applying the crop to the visual representation of the element on the canvas. 
     -  They use the `cropX`, `cropY`, `cropWidth`, and `cropHeight` values from the updated `Placement` object within their `_render` methods to draw only the selected portion of the media onto the canvas.

5. **Final Output:**
   - When the user exports the video using `saveCanvasToVideoWithAudio()`, the crop settings are taken into account during the video generation process. This ensures that the exported video only includes the cropped portion of the media elements.

### 5.2 Key Variables and Functions:

- **`element.placement` (`Placement`)**: Stores the cropping information (`cropX`, `cropY`, `cropWidth`, `cropHeight`) for an editor element.
- **`calculatePixelCrop` (`ReframeModal.tsx`)**:  Converts crop percentages from `ReactCrop` to pixel values relative to the original media.
- **`handleApplyReframe` (`ReframeModal.tsx`)**: Updates the `EditorElement`'s `placement` with the new crop values.
- **`refreshElements` (`Store.ts`)**: Triggers a re-render of the canvas, applying the crop visually.
- **`CoverImage`/`CoverVideo` (`fabric-utils.ts`)**:  These custom Fabric.js classes handle the actual drawing of the cropped media onto the canvas.

This detailed breakdown of the custom cropping mechanism provides a clearer picture of how user interactions, component logic, and data flow within the Fabric Video Editor come together to achieve this functionality.

## 6. FFMPEG.wasm Integration

While the provided code doesn't explicitly showcase the direct usage of FFMPEG.wasm, its role is implied in the `saveCanvasToVideoWithAudio` function. This section will outline how FFMPEG.wasm would likely be integrated into this project for video processing and export, including how to customize output parameters like format and duration.

### 6.1 Video Processing with FFMPEG.wasm: A Conceptual Overview

FFMPEG.wasm brings the power of the popular FFMPEG multimedia framework to the browser using WebAssembly. Here's how it would likely be used in this video editor:

1. **Initialization:**
   - You'd need to load and initialize the FFMPEG.wasm library within your project. There are different ways to do this, including using a CDN or bundling it with your application.

2. **Canvas Capture:**
   - The `saveCanvasToVideoWithAudio` function already demonstrates how to capture the canvas content as a stream using `canvas.captureStream(60)`. This stream will serve as the video input for FFMPEG.wasm.

3. **Audio Handling:**
   - The code also shows how to collect audio streams from `AudioEditorElement`s and merge them into the main canvas stream. This combined stream will contain both video and audio.

4. **FFMPEG.wasm Processing:**
   -  Here's where FFMPEG.wasm comes into play. You would create an FFMPEG.wasm instance and feed it the combined video and audio stream.
   -  You would then use FFMPEG.wasm's API to:
      - **Set Output Format:** Specify the desired video container format (e.g., MP4, WebM).
      - **Control Duration:**  Limit the output video's duration based on the editor's timeline (using the `maxTime` value from the store).
      - **Apply Additional Processing (Optional):** 
         - You could potentially add transitions between elements, apply more complex video filters, adjust audio levels, and perform other video editing operations using FFMPEG.wasm's commands.

5. **Encoding and Output:**
   - Finally, you would instruct FFMPEG.wasm to encode the processed stream into the chosen output format. 
   - FFMPEG.wasm would provide a way to obtain the encoded video data, which you could then use to:
      - Create a downloadable blob for the user.
      - Display a preview of the final video within the editor.

### 6.2 Editing Output Parameters: Format and Duration

- **Format:** You would typically specify the output format using FFMPEG.wasm's command-line-like syntax. For example, to output an MP4 file, you might use a command similar to: 
  ```
  ffmpeg -i input.webm -c:v libx264 -c:a aac output.mp4
  ``` 

- **Duration:** FFMPEG.wasm allows you to control the duration of the output video using the `-t` flag.  You would likely use the `maxTime` property from the MobX store to limit the output duration:
  ```
  ffmpeg -i input.webm -t [maxTime in seconds] output.mp4 
  ```

### 6.3 Example Code (Illustrative):

```javascript
// Simplified example (assumes FFMPEG.wasm is initialized)
async function exportVideo() {
  // ... canvas capture and audio merging logic (as in saveCanvasToVideoWithAudio)

  const ffmpeg = new FFMpeg(); // Create FFMPEG.wasm instance

  ffmpeg.FS('writeFile', 'input.webm', await fetchFile(combinedStream)); // Load stream into FFMPEG.wasm's virtual file system

  await ffmpeg.run(
    '-i', 'input.webm',
    '-c:v', 'libx264', // Video codec
    '-c:a', 'aac',      // Audio codec
    '-t', store.maxTime / 1000, // Duration in seconds
    'output.mp4' 
  );

  const data = ffmpeg.FS('readFile', 'output.mp4'); // Get encoded data
  // ... create downloadable blob or display preview
} 
```

**Note:** This is a simplified illustration. The actual implementation would involve more complex interactions with FFMPEG.wasm's API, error handling, and likely use a worker thread for performance.

By integrating FFMPEG.wasm, the Fabric Video Editor gains the ability to process and export videos with custom format and duration settings, leveraging the extensive capabilities of FFMPEG within a browser-based environment.

## 8. Troubleshooting

This section aims to address potential issues you might encounter while using or developing the Fabric Video Editor, providing solutions or workarounds.

### Common Issues:

1. **Audio Synchronization Problems:**
   - **Problem:** Audio might be out of sync with the video in the exported output.
   - **Possible Causes:**
      -  Inaccurate timing calculations during playback or export.
      -  Issues with merging audio streams from different sources.
   - **Troubleshooting Steps:**
      - Carefully review the logic in `updateTimeTo`, `updateVideoElements`, and `updateAudioElements` in `Store.ts` to ensure proper synchronization of media playback.
      - Double-check the audio merging process in `saveCanvasToVideoWithAudio`.
      - Consider using a logging library to output timestamps during playback and export to aid in debugging.

2. **Exported Video Duration Issues:**
   - **Problem:** The exported video might have an incorrect duration, either too short or too long.
   - **Possible Causes:**
      - Incorrect `maxTime` value in the store.
      -  FFMPEG.wasm duration settings not being applied correctly.
   - **Troubleshooting Steps:**
      - Verify that the `maxTime` property in `Store.ts` accurately reflects the desired video duration.
      -  If using FFMPEG.wasm, ensure that the `-t` flag is used with the correct duration value in seconds.

3. **Flickering in Exported Video:**
   - **Problem:** The exported video might exhibit flickering or visual artifacts.
   - **Possible Causes:**
      - Issues with the canvas capture frame rate.
      - Incompatibilities with certain video codecs or encoding settings.
   - **Troubleshooting Steps:**
      - Experiment with different frame rates for canvas capture (e.g., try 30 or 25 fps instead of 60).
      - Try using different video codecs and encoding settings during FFMPEG.wasm export.
      -  Ensure that your browser and hardware support the chosen codec and encoding settings.

4. **Performance Issues:**
   - **Problem:**  The editor might be slow or laggy, especially with larger projects or longer videos.
   - **Possible Causes:**
      - Inefficient rendering of elements on the canvas.
      - Complex animations or effects.
   - **Troubleshooting Steps:**
      - Optimize canvas rendering in `refreshElements` by minimizing unnecessary redraws.
      - Consider using object caching in Fabric.js for frequently updated elements.
      - Simplify complex animations or effects.

### General Debugging Tips:

- **Browser Developer Tools:**  Make use of your browser's developer tools (especially the Console and Network tabs) to inspect errors, logs, and network activity.
- **Logging:**  Use `console.log` statements strategically within your code to track values, function execution, and timing information.
- **Breakpoints:** If using a debugger like the one in VS Code, set breakpoints in your code to pause execution and inspect variables at specific points.
- **Isolate Issues:** Try disabling certain features or elements to narrow down the source of a problem.


## 9. Glossary

- **Aspect Ratio:** The proportional relationship between an image or video's width and height (e.g., 16:9, 4:3).
- **Codec:** A method for compressing and decompressing digital media (e.g., video or audio). Examples: H.264, VP9 (video codecs), AAC, MP3 (audio codecs).
- **Element:**  An individual media component (video, image, audio, or text) that can be added to the video editor timeline.
- **FFMPEG:**  A popular open-source multimedia framework used for handling video and audio, including encoding, decoding, transcoding, and more.
- **FFMPEG.wasm:** A WebAssembly port of FFMPEG, enabling its usage in web browsers.
- **Fabric.js:**  A JavaScript library that simplifies working with the HTML5 canvas element, providing tools for drawing, manipulating, and animating objects.
- **Keyframe:**  In animation, a specific point in time where an element's properties (e.g., position, opacity) are defined. The animation software interpolates between keyframes to create smooth transitions. 
- **MobX:** A state management library for JavaScript applications, providing a reactive and observable way to manage data.
- **React:** A JavaScript library for building user interfaces. 
- **Timeline:** A visual representation of a video project's structure over time, showing the sequence and duration of elements.
- **TimeFrame:**  The start and end times of an element on the timeline, defining its duration.
- **WebAssembly (Wasm):** A binary instruction format for a stack-based virtual machine, allowing code written in other languages (like C++) to run in web browsers.



I hope this comprehensive documentation has provided valuable insights into the Fabric Video Editor.
