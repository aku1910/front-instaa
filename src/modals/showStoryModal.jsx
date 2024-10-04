import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { BsUpload } from "react-icons/bs";


export default function ShowStoryModal({ addStoryModal, setAddStoryModal }) {
  const [photoUrl, setPhotoUrl] = useState('');
  const imageRef = useRef();

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleUpload = async () => {
    const imageFile = imageRef.current.files[0];
    const formData = new FormData();
    formData.append('storyImage', imageFile);

    try {
      const response = await fetch('api/stories/createStory', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload story');
      }

      const data = await response.json();
      console.log('Story uploaded:', data);
      setAddStoryModal(false);
      setPhotoUrl('');
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Modal
      isOpen={addStoryModal}
      ariaHideApp={false}
      className="grid justify-center mt-[15%]"
      contentLabel="Create Story"
    >
      <div className="storybg bg-zinc-200 w-[300px] sm:w-[300px] h-[200px] grid p-4">
        <h4 className="text-[20px] mb-4 flex justify-center text-white">Create a story </h4>

        <div className="mb-4 flex justify-center">
        <label htmlFor="storyImage" className=" h-[40px] text-[25px] w-[80px] grid justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
        <MdOutlineAddPhotoAlternate  />

          </label>
          <input
            type="file"
            id="storyImage"
            name="storyImage"
            ref={imageRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded">
       <div className='flex justify-center text-[22px]'>
        <BsUpload />

       </div>
        </button>
      </div>
      <button
        className="w-[50px] h-[50px] text-[25px] text-black absolute right-4 top-4"
        onClick={() => setAddStoryModal(false)}
      >
        X
      </button>
    </Modal>
  );
}
