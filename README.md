# Course Manager

A modern, full-featured course management web application for instructors and students, built with **Next.js**, **React**, and a modular, scalable architecture.

![Screenshot](Captura%20de%20pantalla%202025-04-11%20135431.png)

---

## Features

### Instructor View
- **Dashboard:** Overview of courses, students, and grading activity.
- **My Courses:** Create, view, and (soon) edit/delete courses.
- **Grade Students:** Batch grade students, only see those not yet graded.
- **Grades History:** Read-only history of all grades given.

### Student View
- **Dashboard:** Summary cards for enrolled courses, grades, and average; recent grades with comments.
- **Enroll:** Browse all courses, enroll in new ones, see enrollment status.
- **My Courses:** List of all enrolled courses.
- **My Grades:** Table of all grades received, grouped by course.

### General
- **Authentication:** Role-based login and registration (student, instructor, admin).
- **Responsive UI:** Clean, modern design with Lucide icons and Tailwind CSS.
- **Robust State Management:** Context providers for both instructor and student areas.
- **API Integration:** Connects to a RESTful backend (see `Course managaer API.yaml`).

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/yourusername/frontGestorCursos.git
cd frontGestorCursos
npm install
# or
yarn install
```

### Environment Setup

Copy `.env_template` to `.env` and fill in your API server details:

```bash
cp .env_template .env
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
  app/
    instructor/    # Instructor dashboard, courses, grading, grades
    student/       # Student dashboard, enroll, my-courses, my-grades
    login/         # Login page
    register/      # Registration page
  components/      # Reusable UI components
  api/             # API abstraction layer
  lib/             # Shared utilities and types
public/            # Static assets (icons, images)
```

---

## API

The app expects a backend conforming to the [Course managaer API.yaml](Course%20managaer%20API.yaml) OpenAPI spec, supporting:
- User registration and authentication (JWT)
- Course creation, listing, and enrollment
- Grade assignment and retrieval

---

## Roadmap / TODO

- [ ] Improve error messages (parse and display API error bodies)
- [ ] Implement Edit and Delete for courses (backend + frontend)
- [ ] Polish and extend admin features
- [ ] Add more tests and type safety

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE) (or your chosen license)

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Tip:** For a quick demo, use the included test accounts or register a new user.
