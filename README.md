#Data Journalism and D3

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

## Project Overview

In this project I am sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System to discover correlations between health risks and different demographics across 50 states. 

The data set is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml), but you are free to investigate a different data set. The current data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

## Project Details

In this project, I am using  D3 techniques to create an interactive scatter plot that represents each state with circle elements. I am placing multiple labels on each axes and giving them click events so that the users can decide which data to display.The transitions for the circles' locations and axes scales are animated, and each data point has a tooltip that makes it easy to determine the true value without adding another layer of data. The d3-tip.js plugin is used to display a specific element's data once the user hovers their cursor over the element they have selected. 

