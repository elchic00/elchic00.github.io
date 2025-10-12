// src/data.js - UPDATED
export const projects = [
  {
    title: "Invent0ry",
    subtitle: "React and AWS (Amplify)",
    description:
      "This app helps businesses keep track of their inventory across different storage locations. We used Amplify from AWS for authentication, hosting, and for our database & API.",
    image:
      "https://user-images.githubusercontent.com/40577932/168584742-5f09d0d2-5683-46b3-9393-748f5dad6a89.gif",
    link: "https://github.com/elchic00/invent0ry",
  },
  {
    title: "myTeachers",
    subtitle: "React + Express + PostgreSQL + Firebase",
    description:
      "This app helps you keep track of teachers and courses while in school. " +
      "I used MaterialUI for styling components making it responive to mobile and desktop web browsers.",
    image:
      "https://user-images.githubusercontent.com/40577932/168820750-f430fb37-d758-4d7c-b0d2-0e4498756b20.gif",
    link: "https://github.com/elchic00/CunyFirst-front",
  },
  {
    title: "Macros-for-geeks",
    subtitle: "Angular, .Net, SQLite",
    description:
      "A food diary app to help users keep track of their macronutrients. " +
      "They can save their diary to a local SQLite database, which they can later view whether connected to the internet or not.",
    image: "/images/projects/macros.webp",
    link: "https://github.com/elchic00/Macros-for-geeks",
  },
  {
    title: "Crime in Queens NYC",
    subtitle: "Python, HTML, Github MD",
    description:
      "Finding the trend of crime in Queens NYC. This project uses Python data-science libraries to process the data. " +
      "The web-page was created using html and Github MD.",
    image: "/images/projects/crime.webp",
    link: "https://elchic00.github.io/CrimeInQueens",
  },
  {
    title: "Multi-Purpose Calculator",
    subtitle: "Python (PyQT5)",
    description:
      "Multi-Purpose Calculator is a stylish calculator app that features an on-sceen calculator and converter." +
      " This can be cloned and used wherever Python is installed.",
    image: "/images/projects/calculator.webp",
    link: "https://github.com/NesQuickCoding/Multi-Purpose-Calculator",
  },
  {
    title: "myPal",
    subtitle: "React Native, CSS, SQLite",
    description:
      "An Augmentative and Alternative Communication (AAC) mobile app created to help children with autism, special needs, or verbal delays to communicate more effectively.",
    image: "/images/projects/mypal.webp",
    link: "https://github.com/myPal-TMS/myPal",
  },
];
export const skills = [
  "Git + Github",
  "CSS + HTML",
  "JavaScript (ReactJS, TypeScript)",
  "Python",
  "User Analytics",
  "Test Driven Development",
  "Cross-team Collaboration",
  "Agile + Waterfall Methodologies",
  "SQL (SQLite, MySQL, PostgreSQL)",
  "Java",
];

export const trips = [
  {
    id: "ecuador-2024",
    title: "Galapagos Islands",
    location: "Ecuador",
    date: "2025",
    description:
      "Exploring the Galapagos Island in Ecuador. More marine life than one can imagine.",
    photos: [
      {
        url: "/images/travel/optimized/andrew-alagna-turtle-friend.webp",
        fallback: "/images/travel/optimized/andrew-alagna-turtle-friend.jpg",
        alt: "Andrew Alagna - Snorkeling with turtle",
        caption: "Making turtle friends",
      },
      {
        url: "/images/travel/optimized/andrew-alagna-turtle-snorkle.webp",
        fallback: "/images/travel/optimized/andrew-alagna-turtle-snorkle.jpg",
        alt: "Andrew Alagna - Turtle underwater",
        caption: "Swimming alongside sea turtles",
      },
      {
        url: "/images/travel/optimized/andrew-alagna-blue-foot-boobie.webp",
        fallback: "/images/travel/optimized/andrew-alagna-blue-foot-boobie.jpg",
        alt: "Andrew Alagna - Blue-footed booby",
        caption: "Blue-footed booby on the rocks",
      },
      {
        url: "/images/travel/optimized/andrew-alagna-sea-lions.webp",
        fallback: "/images/travel/optimized/andrew-alagna-sea-lions.jpg",
        alt: "Andrew Alagna - Sea lions colony",
        caption: "Sea lions relaxing on the beach",
      },
      {
        url: "/images/travel/optimized/andrew-alagna-isabella-island.webp",
        fallback: "/images/travel/optimized/andrew-alagna-isabella-island.jpg",
        alt: "Andrew Alagna - Isabela Island sign",
        caption: "Isabela Island welcome sign",
      },
      {
        url: "/images/travel/optimized/andrew-alagna-equator.webp",
        fallback: "/images/travel/optimized/andrew-alagna-equator.jpg",
        alt: "Andrew Alagna - Equator monument",
        caption: "Standing at the equator line",
      },
      {
        url: "/images/travel/optimized/andrew-alagna-sunset-boats.webp",
        fallback: "/images/travel/optimized/andrew-alagna-sunset-boats.jpg",
        alt: "Andrew Alagna - Sunset over boats",
        caption: "Beautiful Galapagos sunset",
      },
      {
        url: "/images/travel/optimized/andrew-alagna-sea-horse.webp",
        fallback: "/images/travel/optimized/andrew-alagna-sea-horse.jpg",
        alt: "Andrew Alagna - Seahorse underwater",
        caption: "Seahorse clinging to coral structure",
      },
      {
        url: "/images/travel/optimized/andrew-alagna-inactive-volcano.webp",
        fallback: "/images/travel/optimized/andrew-alagna-inactive-volcano.jpg",
        alt: "Andrew Alagna - Inactive volcano landscape",
        caption: "Hiking the inactive volcano rim",
      },
      {
        url: "/images/travel/optimized/andrew-alagna-land-turtles.webp",
        fallback: "/images/travel/optimized/andrew-alagna-land-turtles.jpg",
        alt: "Andrew Alagna - land turtles",
        caption: "Galápago Tortuga",
      },
    ],
  },
  // {
  //   id: "costarica-2023",
  //   title: "Costa Rican Adventure",
  //   location: "Costa Rica",
  //   date: "2024",
  //   description:
  //     "Exploring the rainforests, beaches, and incredible biodiversity of Costa Rica. Pura Vida!",
  //   photos: [
  //     {
  //       url: "https://via.placeholder.com/800x600?text=Photo+1",
  //       alt: "Rainforest",
  //       caption: "Lush rainforest canopy",
  //     },
  //     {
  //       url: "https://via.placeholder.com/800x600?text=Photo+2",
  //       alt: "Beach",
  //       caption: "Beautiful Pacific coast beach",
  //     },
  //     {
  //       url: "https://via.placeholder.com/800x600?text=Photo+3",
  //       alt: "Wildlife",
  //       caption: "Sloth in the wild",
  //     },
  //     {
  //       url: "https://via.placeholder.com/800x600?text=Photo+4",
  //       alt: "Waterfall",
  //       caption: "Stunning waterfall hike",
  //     },
  //     {
  //       url: "https://via.placeholder.com/800x600?text=Photo+5",
  //       alt: "Volcano",
  //       caption: "Arenal Volcano view",
  //     },
  //     {
  //       url: "https://via.placeholder.com/800x600?text=Photo+6",
  //       alt: "Sunset",
  //       caption: "Caribbean coast sunset",
  //     },
  //   ],
  // },
];
