import { useEffect, useState } from "react";
import axios from "axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:5000/api/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleJoin = async (projectId) => {
    const userId = localStorage.getItem("userId");

    await axios.post(
      `http://localhost:5000/api/projects/join/${projectId}`,
      { userId }
    );

    alert("Request sent");
  };

  return (
    <div>
      <h2>All Projects</h2>

      {projects.map((p) => (
        <div key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>

          <button onClick={() => handleJoin(p._id)}>
            Join
          </button>
        </div>
      ))}
    </div>
  );
}