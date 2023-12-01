# react-statefy
react-statefy is a lightweight state management solution for React applications. It offers a simple and intuitive API for managing and mutating application state, making it ideal for small to medium-sized React projects.

## Installation
To install the package, run the following command in your project directory:

```bash
npm install react-statefy
```

## Usage

#### Sample App
See 

https://codesandbox.io/p/sandbox/statefy-sample-app-lzzhmj
https://github.com/faaydemir/statefy-sample-app

#### Importing Statefy
First, import statefy from react-statefy:
```javascript
import statefy from "react-statefy";
```

#### Creating a State
Define your application state using statefy:
```javascript
const blogState = statefy({
    bookmarks: false,
    posts: undefined,
});
```

#### Mutating State
react-statefy provides a mutate method to update your state. Here's an example of how to mutate the state:
```javascript
export const postsLoaded = (posts) => {
    blogState.mutate({
        posts: posts,
    });
}

export const bookmarksLoaded = (bookmarks) => {
    blogState.mutate({
        bookmarks: bookmarks,
    });
}

```

#### Using State in Components
Use the useStatefy hook to access your state within components:

```javascript
import { useStatefy } from "react-statefy";

const Posts = () => {
    
    useEffect(() => {
        loadPosts();
    }, []);

    const { posts } = useStatefy(blogState,'posts'); // only render when posts change
    return <> {posts.map(post => <Post post={post} />)}</>
}

```

```javascript
export const loadPosts = async () => {
    const posts = await fetchPosts();
    postsLoaded(posts)
}
```

you can put loadPosts method to seperate file and import it in your component.