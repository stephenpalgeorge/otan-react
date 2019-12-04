# LORIS REACT

*Loris React is helpful.*
Almost every react project involves creating some sort of library of components.
The number of ways that you can structure and organise your code is limited mostly 
by your imagination. Loris React has an opinion on how to do this and it'll take care 
of all the leg work for you.

The concept is simple, a 'library' directory that houses all your components, grouped 
into a selection of sub directories. Loris also makes some assumptions, the most 
important one is probably that it expects you to be using [Sass](https://sass-lang.com/, "sass-lang") for your styling code. I might change this in future so you can opt in to Sass, but for now, it's Sass 
all the way.

### Atomic design
The organisation of loris components is based on atomic design principles. You can 
create a directory of protons, atoms, molecules, organisms and layouts (sorry this 
one doesn't quite fit the naming pattern..!). By default, loris recommends atoms, 
molecules and organisms.

**Atoms** are small units of reusable UI, typical examples would be Button, Title, 
Image. **Molecules** bring two or more atoms together, so a Card molecule might comprise 
Title, Text and a couple of Button atoms. **Organisms** bring two or more molecules, or 
a combinaton of molecules and atoms together, so a Hero organism might comprise an 
Image atom and a Card molecule.

---

## Getting started
Either install loris-react globally or run the commands using npx. The examples below 
assuming a global installation, but you can read more about npx [here](https://www.npmjs.com/package/npx, "npx")

`npm i -g loris-react` installs loris-react globally, so you can run it from anywhere in 
your command line. Once it's installed you can run `loris-react` to see some introductory 
information and a list of available commands.

### Commands
#### Setup
```
loris-react setup
```

This is the first command you'll want to run for a new project. You should run this from the 
directory where you want to your component library to be generated. Loris will check the location 
with you before it does anything, so just say no and cd into the right place before running 
the command again if you need to.

Next, you can choose which directories you want to be included in your library. Let's assume you 
have a src directory where all your application code is stored, you run `loris-react setup` and 
accept all the defaults, loris will scaffold the following file structure for you:

```
src/
|-- /library
|--|-- /01-atoms
|--|--|-- index.js
|--|-- /02-protons
|--|--|-- index.js
|--|-- /03-organisms
|--|--|-- index.js
|--| data.js
|--| index.js
|--| library.scss
```


*library/index.js* - this file imports and exports all of your components from each atomic 
directory. This means consuming your components is really easy, something like this (image 
we're working in src/HomePage.js):
```
// src/HomePage.js

import React from 'react'
// import components from your loris-react
// component library. Adjust the file path
// to the library as required
import { HeroBanner, PageTitle, Button } from './library'
```

*library/library.scss* - this file imports all of the sass partials in your components. For 
your component styles to make it into your app code, you'll need to import this file somewhere.
Let's assume you have an index.scss file in your project root that gets imported in the entry point 
js file:
```
// /index.scss

@import './src/styles/global-styles.scss';
// load all of your loris component styles
@import './src/library/library.scss';
```
From here on in, you can create your components manually if you want, but loris will write 
the boilerplate for you if you ask it to.

#### New
```
loris-react new
```

This command generates a new React Component. Loris assumes you're using modern react features 
like hooks, so all components will be created as functional components, but you can obviously 
rewrite any of this code and use classes if you'd prefer.

**What happens when I generate a new component with the CLI?**
Loris will create a folder within the desired components directory (atoms, molecules etc). You 
can choose which files to include (more information on these later) and loris will generate 
them for you.
On top of this, loris will write your new component to that directory's index.js, to the 
library's index.js and (if you chose to include a sass file) it will write an import 
statement to the library/library.scss file.

So let's suppose you ran the command, chose to creat the component in library/01-atoms and 
gave it the name "Button", you would now have something like this:

```
src/
|-- /library
|--|-- /01-atoms
|--|--|-- /Button
|--|--|--|-- Button.js
|--|--|--|-- data.js
|--|--|--|-- _button.scss
|--|--|--|-- button.test.js
|--|--|-- index.js
|--|-- /02-protons
|--|--|-- index.js
|--|-- /03-organisms
|--|--|-- index.js
|--| index.js
|--| library.scss
```

The files *library/01-atoms/index.js* && *library/index.js* will now include an import statement for Button and 
an export object that includes Button. The file *library/library.scss* will now include an import statement for 
01-atoms/Button/button.


### Component Files
When you generate a new component, Loris will ask you which files you want to include. You can choose any or all 
of 'js', 'sass', 'data', 'test'. Some of these are more obvious than others, but here follows a brief explanation 
of what each file does:

#### JS - component javascript file
This is the basic .js file that will create your react component. You can of course create more files in this 
directory if you want to break your component out across two or three different files, but be aware that, by 
deafult, Loris only imports this generated JS file, so if you do add your own you will either need to manually 
import/export them in the directories index and the library index, or include them in this generated JS file.

#### SASS - component styles
This is where you would put any component-specific styles. *N.B. this file is not imported in the component 
JS file but is included instead in the library/library.scss file.* We think this makes it easier to keep 
track of the cascade as you will be include all component styles as one either before or (probably) after 
any global styles you have written.

#### DATA - props values
Data files are a pattern that Loris encourages. They are basically a separate file for housing all of your 
props values for a particular component. Then, when you consume the component, you can also import the component's
data file and pass the object straight down. We think this helps with maintainability as well.

*N.B. data files are probably not useful if you're making a component library that you intend to publish,
since third-party consumers of your library won't have read and write access to this file.* Data files are 
intended for a project where your components and their data are sharing a directory. If you are using a third 
party component library, we still think data files is a pattern worth adopting.

Here's a couple of examples:

Suppose this component:
```
import React from 'react'
import PropTypes from 'prop-types'

const TextBlock = ({
    heading,
    body
}) => {
    return (
        <div className="text-block">
            <h2>{ heading }</h2>
            <p>{ body }</p>
        </div>
    )
}

TextBlock.propTypes = {
    heading: PropTypes.string,
    body: PropTypes.string.isRequired
}

export default TextBlock
```

You can see we have defined two props, "heading" and "body". Now let's write our data file for this component:
```
const data = {
    heading: "Loris React Component Library",
    body: "Loris-react is designed to help you quickly scaffold and generate React component libraries."
}

export default data
```

Now, when you come to use the TextBlock component you can do this:
```
import React from 'react'

import { TextBlock } from './library'
import { TextBlockData } from './library/data'

const HomePage = () => (
    <div>
        <TextBlock {...TextBlockData} />
    </div>
)
```

It doesn't look like much at the moment, but imagine if TextBlock had a dozen props, and 3 of them were 
long file paths to images/assets, and the "body" prop text was a couple of hundred words long! Keeping it 
all together makes sense.
But, you're probably going to want to use your components in more than just the once place, with more than 
one set of data! There are probably a few ways that you could structure this code, but we reckon it makes 
most sense just to nest some more objects inside of your data object. Like:
```
const data = {
    homepage: {
        heading: "Loris React Component Library",
        body: "Loris-react is designed to help you quickly scaffold and generate React component libraries."
    },
    aboutpage: {
        heading: "This is the about page",
        body: "The data is different but we've stored it under an intuitively named property of our data object"
    }
}

export default data
```

Now when you're consuming your data, something like this:
```
import React from 'react'

import { TextBlock } from './library'
import { TextBlockData } from './library/data'

const HomePage = () => (
    <div>
        // now we specifically target the homepage 
        // property of our data object
        <TextBlock {...TextBlockData.homepage} />
    </div>
)
```

#### TEST
If you've used create-react-app you'll have jest (and a test script) ready to go, so these files 
should just work. Out of the box Loris just writes a simple test that checks your component will 
successfully render to the DOM, obivously you should add many more of your own tests to this file!