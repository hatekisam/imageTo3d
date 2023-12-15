"use client";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const Uploader = () => {
  // State
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [images, setImages] = useState<any[]>();
  const [title, setTitle] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [allImages, setAllImages] = useState<any[]>();
  const [error, setError] = useState("");

  // Helper function to generate a random string
  const generateRandomString = (): string => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < 15; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  };

  const get3dModel = async () => {
    setLoading(true);
    console.log("Clicked");
    setTitle(generateRandomString());
    const reader = new FileReader();
    const readFileAsync = (file: File) => {
      return new Promise<Uint8Array>((resolve, reject) => {
        reader.onload = () =>
          resolve(new Uint8Array(reader.result as ArrayBuffer));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    };

    try {
      const imageArray = [];
      for (let i = 0; i < allImages?.length!; i++) {
        //@ts-ignore
        const img = await readFileAsync(allImages[i]);
        imageArray.push(img);
      }
      const tite = generateRandomString();
      const captureResponse = await axios.post(
        "https://webapp.engineeringlumalabs.com/api/v2/capture",
        { title: tite },
        {
          headers: {
            Authorization: `luma-api-key=${process.env.NEXT_PUBLIC_LUMA_API}`,
          },
        }
      );

      console.log(captureResponse);

      const { signedUrls, capture } = captureResponse.data;

      setUploadUrl(signedUrls.source);
      setSlug(capture.slug);
      const slu = capture.slug;
      // Use the content type based on your API requirements
      await axios.put(signedUrls.source, imageArray, {
        headers: {
          "Content-Type": "application/octet-stream", // Adjust this content type
        },
      });

      console.log("finished the put");

      const completeResponse = await axios.post(
        `https://webapp.engineeringlumalabs.com/api/v2/capture/${slu}`,
        {},
        {
          headers: {
            Authorization: `luma-api-key=${process.env.NEXT_PUBLIC_LUMA_API}`,
          },
        }
      );

      console.log(completeResponse);

      let getResultResponse = await axios.get(
        `https://webapp.engineeringlumalabs.com/api/v2/capture/${slu}`,
        {
          headers: {
            Authorization: `luma-api-key=${process.env.NEXT_PUBLIC_LUMA_API}`,
          },
        }
      );

      console.log(getResultResponse);
      while (getResultResponse.data.latestRun.status !== "dispatched") {
        getResultResponse = await axios.get(
          `https://webapp.engineeringlumalabs.com/api/v2/capture/${slu}`,
          {
            headers: {
              Authorization: `luma-api-key=${process.env.NEXT_PUBLIC_LUMA_API}`,
            },
          }
        );
        console.log(getResultResponse);
      }

      console.log("Finished");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dropzone callback function
  const onDrop = useCallback(async (acceptedFiles: any) => {
    setAllImages(acceptedFiles);
    try {
      const promises = acceptedFiles.map(async (file: File) => {
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          return new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        } else {
          throw new Error("Invalid image file.");
        }
      });

      const dataUrls = await Promise.all(promises);
      setImages(dataUrls);
    } catch (err: any) {
      console.error("Error:", err.message);
    }
  }, []);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-3">
      <div
        {...getRootProps()}
        className="w-[400px] h-[400px] rounded-md border-2 border-blue-400 p-5 flex items-center justify-center"
      >
        <input {...getInputProps()} accept="image/*" />
        {images ? (
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, i) => {
              return <img src={img} alt="" key={i} />;
            })}
          </div>
        ) : (
          <>
            {isDragActive ? (
              <p className="text-gray-500 text-center text-lg">
                Drop the files here ...
              </p>
            ) : (
              <p className="text-gray-500 text-center text-lg">
                Drag 'n' drop an 10 images here, or click to select an image
              </p>
            )}
          </>
        )}
      </div>
      {!loading ? (
        <button
          onClick={get3dModel}
          className="bg-blue-500 px-4 py-2 rounded-lg text-white"
        >
          Get 3D Model
        </button>
      ) : (
        <div className="bg-blue-500 px-4 py-2 rounded-lg text-white">
          Loading
        </div>
      )}
      <p className="text-red-500">{error}</p>
    </div>
  );
};

export default Uploader;
