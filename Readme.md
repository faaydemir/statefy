# react-statefy
react-statefy is a lightweight state management solution for React applications. It offers a simple and intuitive API for managing and mutating application state, making it ideal for small to medium-sized React projects.

## Installation
To install the package, run the following command in your project directory:

```bash
npm install react-statefy
```

## Usage

#### Sample App
Sample app is available at
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
    blogs: undefined,
});
```

#### Mutating State
react-statefy provides a mutate method to update your state. Here's an example of how to mutate the state:
```javascript
export const blogsLoaded = (blogs) => {
    blogState.mutate({
        blogs: blogs,
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
you can put mutators separately in a file and import them in your component

```javascript
import { useStatefy } from "react-statefy";

const MyComponent = () => {
    
    useEffect(() => {
        loadBlogs();
    }, []);

    const { blogs } = useStatefy(blogState, 'blogs'); // only render when blogs change
    return <> {blogs.map(blog => <Blog blog={blog} />)}</>
}
```

```javascript
export const loadBlogs = async () => {
    const blogs = await fetchBlogs();
    blogsLoaded(blogs)
}
```