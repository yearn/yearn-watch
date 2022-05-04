# yearn-watch

In order to install Yearn Watch on your device, please create a .npmrc file with the following content
```
registry=https://registry.npmjs.org/
@yearn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_ACCESS_TOKEN
```
You will need to generate a [Github Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

Then, you can run it with
```
yarn && yarn dev
```
