import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { toast } from 'react-toastify';
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import UserService from "../../Services/UserService";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import "../AuthPage/Login.css";

export default function AddCertification({ userId }) {
  const [skills, setSkills] = React.useState([]);


  React.useEffect(() => {
    addSkill();
  }, []);

  const handleSkillChange = (index, key, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][key] = value;
    setSkills(updatedSkills);
  };
  const handleProjectChange = (skillIndex, projectIndex, key, value) => {
    const updatedSkills = [...skills];
    updatedSkills[skillIndex].projects[projectIndex][key] = value;
    setSkills(updatedSkills);
  };

  const handleCertificationChange = (
    skillIndex,
    certificationIndex,
    key,
    value
  ) => {
    const updatedSkills = [...skills];
    updatedSkills[skillIndex].certifications[certificationIndex][key] = value;
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([
      ...skills,
      {
        id: Math.random().toString(36).substr(2, 9),
        skillName: "",
        proficiencyLevel: "",
        projects: [],
        certifications: [],
      },
    ]);
  };

  const addProject = (skillIndex) => {
    const updatedSkills = [...skills];
    updatedSkills[skillIndex].projects.push({
      id: Math.random().toString(36).substr(2, 9),
      projectName: "",
      projectDescription: "",
      projectExperience: "",
      role: "",
    });
    setSkills(updatedSkills);
  };

  const addCertification = (skillIndex) => {
    const updatedSkills = [...skills];
    updatedSkills[skillIndex].certifications.push({
      id: Math.random().toString(36).substr(2, 9),
      certificationName: "",
      certificationFile: "",
      issuedDate: "",
      expiryDate: "",
    });
    setSkills(updatedSkills);
  };

  const removeProject = (skillIndex, projectIndex) => {
    const updatedSkills = [...skills];
    updatedSkills[skillIndex].projects.splice(projectIndex, 1);
    setSkills(updatedSkills);
  };

  const removeCertification = (skillIndex, certificationIndex) => {
    const updatedSkills = [...skills];
    updatedSkills[skillIndex].certifications.splice(certificationIndex, 1);
    setSkills(updatedSkills);
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { skills };
      await UserService.addCertification(userId, userData);
      toast.success("Certifications added successfully.");
    } catch (error) {
      console.error("Error adding certifications:", error);
      toast.error("Failed to add certifications. Please try again.");
    }
  };

  return (
    <div className="centered-container">
      
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <center className="login-head">Tech Stack Details</center>
        {skills.map((skill, skillIndex) => (
          <div key={skill.id}>
            <TextField
              label="Skill Name"
              value={skill.skillName}
              onChange={(e) =>
                handleSkillChange(skillIndex, "skillName", e.target.value)
              }
            />
            <TextField
              label="Proficiency Level"
              select
              value={skill.proficiencyLevel}
              onChange={(e) =>
                handleSkillChange(
                  skillIndex,
                  "proficiencyLevel",
                  e.target.value
                )
              }
            >
              <MenuItem value="">Select proficiency level</MenuItem>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </TextField>
            <br />
            <br />
            <Button
              variant="contained"
              color="success"
              onClick={() => addProject(skillIndex)}
            >
              <AddIcon />
              Add Project
            </Button>
            {skill.projects.map((project, projectIndex) => (
              <div key={project.id}>
                <br />
                <TextField
                  label="Project Name"
                  value={project.projectName}
                  onChange={(e) =>
                    handleProjectChange(
                      skillIndex,
                      projectIndex,
                      "projectName",
                      e.target.value
                    )
                  }
                />
                <TextField
                  label="Project Description"
                  value={project.projectDescription}
                  onChange={(e) =>
                    handleProjectChange(
                      skillIndex,
                      projectIndex,
                      "projectDescription",
                      e.target.value
                    )
                  }
                />
                <br />
                <TextField
                  label="Project Experience"
                  value={project.projectExperience}
                  onChange={(e) =>
                    handleProjectChange(
                      skillIndex,
                      projectIndex,
                      "projectExperience",
                      e.target.value
                    )
                  }
                />
                <TextField
                  label="Role"
                  select
                  value={project.role}
                  onChange={(e) =>
                    handleProjectChange(
                      skillIndex,
                      projectIndex,
                      "role",
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="Project Manager">Project Manager</MenuItem>
                  <MenuItem value="Team Lead">Team Lead</MenuItem>
                  <MenuItem value="Developer/Programmer">
                    Developer/Programmer
                  </MenuItem>
                  <MenuItem value="Designer">Designer</MenuItem>
                  <MenuItem value="Quality Assurance (QA) Engineer">
                    Quality Assurance (QA) Engineer
                  </MenuItem>
                  <MenuItem value="Business Analyst">Business Analyst</MenuItem>
                  <MenuItem value="Subject Matter Expert (SME)">
                    Subject Matter Expert (SME)
                  </MenuItem>
                </TextField>

                <br />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeProject(skillIndex, projectIndex)}
                  >
                    <RemoveIcon />
                  </Button>
                </div>
              </div>
            ))}
            <br />
            <br />
            <Button
              variant="contained"
              color="success"
              onClick={() => addCertification(skillIndex)}
            >
              <AddIcon />
              Add Certification
            </Button>
            {skill.certifications.map((certification, certificationIndex) => (
              <div key={certification.id}>
                <TextField
                  label="Certification Name"
                  value={certification.certificationName}
                  onChange={(e) =>
                    handleCertificationChange(
                      skillIndex,
                      certificationIndex,
                      "certificationName",
                      e.target.value
                    )
                  }
                />
                <TextField
                  label="Certification File (Link or Drive)"
                  value={certification.certificationFile}
                  onChange={(e) =>
                    handleCertificationChange(
                      skillIndex,
                      certificationIndex,
                      "certificationFile",
                      e.target.value
                    )
                  }
                />
                <br />
                <TextField
                  label="Issued Date"
                  type="date"
                  value={certification.issuedDate}
                  onChange={(e) =>
                    handleCertificationChange(
                      skillIndex,
                      certificationIndex,
                      "issuedDate",
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ placeholder: " " }}
                />
                <TextField
                  label="Expiry Date"
                  type="date"
                  value={certification.expiryDate}
                  onChange={(e) =>
                    handleCertificationChange(
                      skillIndex,
                      certificationIndex,
                      "expiryDate",
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ placeholder: " " }}
                />
                <br />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      removeCertification(skillIndex, certificationIndex)
                    }
                  >
                    <RemoveIcon />
                  </Button>
                </div>
              </div>
            ))}
            <br />
            <br />
            <Button
              variant="contained"
              color="error"
              onClick={() => removeSkill(skillIndex)}
            >
              Remove Skill
            </Button>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="success" onClick={addSkill}>
            <AddIcon />
          </Button>
        </div>
        <br />
        <div>
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="contained"
            size="large"
            sx={{ width: "100%" }}
          >
            Submit
          </Button>
        </div>
      </Box>
    </div>
  );
}
