# Full Stack Assessment Test

## Introduction

Thank you for applying for a position at eOnsight; we appreciate your interest in our company.
Thank you for your time, we wish you the best for this assessment!

## Overview and Purpose of this test

**Objective:** Develop a **web application** that enables users to visualize and analyze **hydrometric** and **infrastructure** data through an **interactive map**, with dynamic **widgets** displaying **data** in the form **graphs**.  

**Estimated duration:** 5-6 hours

You will need to submit your code in form of a **Git repository** (more details below).

This assessment test is designed to evaluate your ability to deliver an interactive **web application** using:

- the following tech stack: `Django, Angular, PostgreSQL, and PostGIS`
- calls to public APIs

Note that we will also assess your:

- **quality of code** based on the following criteria:
  - **readablity and documentation**,
  - **modularity**,
  - **reproductibility**.

- intuition for **User Experience (UX)** optimization
- **creativity**, especially in the frontend components.
- ability to **collaborate** effectively using **GitLab** through the use of:
  - Gitlab issues
  - Merge Requests (MRs)

## Context (fictitious use case)

A governmental agency in the Alpes-Maritimes region (06) reaches out to you for help: they manage a network of **hydrometric stations** monitoring **water levels** and **flow rates** across the region’s rivers and streams. These stations provide critical data for ensuring effective water management and climate-change mitigation, with direct impact onto public safety.
The agency's current system falls short in several key areas, limiting their ability to respond effectively to a rapidly changing environment. They ask for your expertise to develop a scalable, modern digital solution.

The agency explained listed the following challenges:

- **Operational Status:** Some hydrometric stations are *out of service*, but they have no efficient way to see which ones are still active inside their region of jurisdiction.
- **Data Visualization:** The collected is not presented in visual way that would allow them to quickly detect critical trends, i.e. weekly changes in water level, influencing the region’s particular hydrological and ecological conditions.  
- **Geographic Information System (GIS) Integration:** They need to visualize station locations along with key infrastructure that is affected by rivers, i.e. **bridges** on a unified map.

## Your Mission

The solution the agency has asked you for has to combine:

- **External Data Integration:** Connecting seamlessly to the [*Hubeau* API](https://api.gouv.fr/documentation/api_hubeau_hydrometrie) to retrieve hydrometric data.  
- **Backend Development:** Setting up a custom server to manage and serve the provided infrastructure [data on bridges](./sample_bridges.csv).  
- **GIS and Mapping:** Displaying hydrometric stations and bridge locations on an interactive map.  
- **Data Visualization:** Creating intuitive graphs to help them understand trends quickly.  
- **UX:** A clean, user-friendly interface that simplifies their workflow.  

### Tasks

#### Part 1: Set up the `PostgreSQL` + `PostGIS` database

Set up a `PostgreSQL` database with `PostGIS` extension and load the data from the `.csv` file `sample_bridges.csv` into it.
This is a necessary but not a core part of the test, meaning that you will not be evaluated on how you set up the database. This is why we provide you with detailed instructions, cf. [`SETUP_DATABASE.md`](./SETUP_DATABASE.md).

#### Part 2: Backend Development (`Django` mandatory)

Here starts the core part of the test. `Django` is a popular web framework for building web applications.
Create a Django project that will load the data from the previously-created database.

It is mandatory to use the `Django REST Framework` to create **API endpoints** for:

- Listing all bridges.
- Retrieving details of a single bridge.
- Adding a new bridge.
- Updating the details of an existing bridge.
- Deleting a bridge.

#### Part 3: Frontend Development (`Angular` mandatory)

##### Set up a front-end project

*Concerning hydrometric stations:*

- Create a component that integrates a `Leaflet` map displaying the **hydrometric stations** (only the ones in the region). The data should be retrieved from the [Hubeau API](https://api.gouv.fr/documentation/api_hubeau_hydrometrie).
- The web-app should allow users to optionally hide from the map the non-operational stations. When all stations are displayed, ensure that operational stations are visually distinct from non-operational ones.  
- Add **interactivity** to your map, so that clicking on a station marker shows *relevant information* of that station to the user inside a **sidebar**.
- Ensure that the sidebar updates *dynamically*, as users interact with different stations on the map.

*Concerning infrastructures (bridges):*

- Use the **backend API** to retrieve infrastructure data and display it dynamically on the map.
- Ensure the infrastructure markers are visually distinct from hydrometric stations.  

##### Create Interactive Widgets

- Create a component that generates a graph displaying the most recent hydrometric observations for a selected station. The data should represent water level trends over the current week.
- Use a charting library such as `Chart.js` or `D3.js` to render the graph *dynamically*.  
- Ensure the widget updates automatically when a new station is selected from the map, reflecting the latest observations for that station.

## Collaboration

For this test, we will also evaluate your ability to collaborate effectively in a structured environment, i.e. **GitLab**.

Before starting the project, create a *new Gitlab repository in your account* and add the users `@ChevrierDev`, `@Cochonaki` and `@nc-eonsight` with the adequate level of privileges. Implement the following steps in your repository:

- Open a **new issue** outlining how you plan to proceed with the project.

- Create a dedicated development `dev` branch where you will deliver your solution.

- Deliver your work in form of a **Merge Request (MR)** of your `dev` branch to your `main` branch.  
  - In the MR's description, provide a clear and succinct description of the work done.  
  - **Only once ready for submitting your work**: add the users `@ChevrierDev`, `@Cochonaki` and `@nc-eonsight` as **reviewers** of your MR.
  
## Important

- Your submission will be considered complete once we receive a Merge Request with the afore-mentioned reviewers and that is not in `draft` mode.
- We will not consider *any* work submitted *after* the indicated deadline.

*Happy coding!*
