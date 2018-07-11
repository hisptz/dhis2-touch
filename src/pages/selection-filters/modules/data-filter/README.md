# Data filter module

Angular 4 power data filter module for DHIS2 visualizations

# Installation

This component assumes that the angular app is created using [angular cli](https://cli.angular.io/).

To use this module add it as git submodule on your working directory (app directory for ng2/4 project) as follows:

`git submodule add git@github.com:hisptz/data-filter-module.git src/app/data-filter`

### Using Submodules

In order to fill in the submodule’s path with the files from the external repository, you must first initialize the submodules and then update them.

`git submodule init`

`git submodule update`

For more about git submodules click [here](https://chrisjean.com/git-submodules-adding-using-removing-and-updating/)

# Using menu module

In order to use data filter module, import the module in your app.module.ts or any module you want it used as follows;

```
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DataFilterModule //Module for data filter
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

In your app component, add data filter component as follows;

`<app-data-filter></app-data-filter>
`

# Update data filter Submodule

If you want to pull new changes from data filter repository, do as follows

1. Change to data filter module directory

`cd src/app/data-filter`

2. Pull new changes from the repository for the stable branch (master)

`git pull origin master`
