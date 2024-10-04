// postAction.js
export const likePost = (id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/post/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Error liking the post:', errorMessage);
            throw new Error('Server error');
        }

        const updatedPost = await response.json();
        dispatch({ type: 'LIKE_POST', payload: updatedPost });
    } catch (error) {
        console.error('Error liking the post:', error);
    }
};

export const unlikePost = (id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/post/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Error unliking the post:', errorMessage);
            throw new Error('Server error');
        }

        const updatedPost = await response.json();
        dispatch({ type: 'UNLIKE_POST', payload: updatedPost });
    } catch (error) {
        console.error('Error unliking the post:', error);
    }
};
