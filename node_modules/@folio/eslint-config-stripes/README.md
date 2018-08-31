# eslint-config-stripes

This package provides an extensible shared [ESLint](https://eslint.org) config, intended to promote consistent code style among applications built with [FOLIO Stripes](https://github.com/folio-org/stripes-core).

## Installation
If you haven't already installed ESLint as a dev dependency in your project, it's a required peer of `eslint-config-stripes`:
```
yarn add eslint -D
```

Then add `eslint-config-stripes` to your `devDependencies`:
```
yarn add eslint-config-stripes -D
```

Create `.eslintrc` in the root of your project. Its contents:
```
{
  "extends": "stripes"
}
```

### Using Babel?
If you're extensively using newer JavaScript syntax with Babel, you may want to use [`babel-eslint`](https://github.com/babel/babel-eslint) in your FOLIO project.
```
yarn add babel-eslint -D
```

In `.eslintrc`, specify your parser:
```
{
  "extends": "stripes",
  "parser": "babel-eslint"
}
```

## Usage
Run `eslint src` in your terminal to lint the files in the `src` directory (or modify to wherever the primary source of your project lives).

### Recommended
Add to your `package.json` `scripts`, so you can simply run `yarn lint`:
```
"lint": "eslint src"
```

## Additional information

See project [STRIPES](https://issues.folio.org/projects/STRIPES) at the [FOLIO issue tracker](http://dev.folio.org/community/guide-issues).

Other FOLIO Developer documentation is at [dev.folio.org](http://dev.folio.org/).
