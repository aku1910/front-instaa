import React, { useEffect, useState } from 'react';
import ShowStoryModal from '../modals/showStoryModal';
import Modal from 'react-modal';
import Stories from 'react-insta-stories';
import { useSelector } from 'react-redux';

const Story = () => {
  const user = useSelector(state => state.user.user);

  const [addStoryModal, setAddStoryModal] = useState(false);
  const [openStory, setOpenStory] = useState(false);
  const [stories, setStories] = useState([]);
  const [currentStories, setCurrentStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const storyStyles = {
    width: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
  };

  useEffect(() => {
    getStories();
  }, [addStoryModal]);

  const getStories = async () => {
    try {
      const response = await fetch('/api/stories/getStories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setStories(data);
      } else {
        throw new Error('Response is not an array');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const groupStoriesByUser = () => {
    const groupedStories = stories.reduce((acc, story) => {
      const { userName } = story.user;
      if (!acc[userName]) {
        acc[userName] = [];
      }
      acc[userName].push(story.storyImage);
      return acc;
    }, {});
    return Object.entries(groupedStories).map(([userName, userStories]) => ({
      userName,
      stories: userStories,
    }));
  };

  const groupedStories = groupStoriesByUser();

  const handleStoryEnd = () => {
    // Automatically move to the next story group
    if (currentStoryIndex < currentStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentGroupIndex < groupedStories.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrentStories(groupedStories[currentGroupIndex + 1].stories);
      setCurrentStoryIndex(0); // Reset the story index for the new group
    } else {
      // Optionally handle end of all stories (e.g., close modal)
      setOpenStory(false);
    }
  };

  return (
    <div className="">
      <div className="w-[250px] md:w-[80%] sm:w-[400px] mx-auto h-[115px] relative flex items-center justify-start overflow-x-auto scrollbar-hidden">
        <div className="flex items-center space-x-4">
          <div className="hover:scale-105 transition-transform duration-300 ease-in-out">
            <button className="relative border-none bg-white">
              <img
                className="w-[65px] h-[60px] rounded-full border border-red-500 object-cover"
                src={user?.user?.profilePic}
                alt="Profile"
              />
              <button
                onClick={() => setAddStoryModal(true)}
                className="absolute right-0 bottom-3 flex items-center justify-center rounded-full w-[25px] h-[25px] bg-blue-500 text-white text-[15px]"
              >
                +
              </button>
              <p className="text-center text-xs font-medium text-gray-500">
                Add Story
              </p>
            </button>
          </div>
          <div className="flex gap-2 w-[660px]">
            {groupedStories.map((group, index) => (
              <div key={index} className="hover:scale-105 transition-transform duration-300 ease-in-out">
                <button
                  onClick={() => {
                    setOpenStory(true);
                    setCurrentGroupIndex(index); // Set current group index
                    setCurrentStories(group.stories);
                    setCurrentStoryIndex(0); // Reset the story index
                  }}
                  className="border-none bg-white"
                >
                  <img
                    className="w-[60px] h-[60px] rounded-full border border-red-500 object-cover"
                    src={group.stories[0]} // İlk hikaye resmi gösterilir
                    alt={group.userName}
                  />
                  <p className="text-center text-xs font-medium text-gray-500">
                    {group.userName}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ShowStoryModal
        addStoryModal={addStoryModal}
        setAddStoryModal={setAddStoryModal}
      />
      <Modal
        isOpen={openStory}
        ariaHideApp={false}
        className="grid justify-center mt-[6%]"
        contentLabel="View Story"
      >
        <div className="bg-zinc-200 max-w-full">
          <Stories
            loop={false} // Disable looping to manage with custom logic
            stories={currentStories}
            defaultInterval={1500}
            width="330px"
            height={490}
            storyStyles={storyStyles}
            onStoryEnd={handleStoryEnd} // Handle story end to transition to the next story
            currentIndex={currentStoryIndex} // Track current story index
            onStoryChange={(index) => setCurrentStoryIndex(index)} // Update index on story change
          />
        </div>
        <button
          className="text-black absolute top-0 right-0 text-[25px]"
          onClick={() => setOpenStory(false)}
        >
          X
        </button>
      </Modal>
    </div>
  );
};

export default Story;
