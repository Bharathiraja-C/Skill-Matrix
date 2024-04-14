import React, { useState, useEffect } from "react";
import UserService from "../../Services/UserService";
import { Table, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import "../UserPage/UserDetails";
import TableSkeleton from "../Skeleton/TableSkeleton"; 

const UserDetails = ({ userId, skillId }) => {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
        try {
        const userData = await UserService.getUserDetails(skillId);
        setUserDetails(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, skillId]);

  const handleApprove = async () => {
    try {
      await UserService.updateUserStatus(userId, skillId, "Approved");
      setUserDetails((prevUserDetails) => ({
        ...prevUserDetails,
        status: "Approved",
      }));
      toast.success("Details successfully approved!"); // Set the success message
    } catch (error) {
      console.error("Error approving user details:", error);
    }
  };

  const handleNotApprove = async () => {
    try {
      await UserService.updateUserStatus(userId, skillId, "Not Approved");
      setUserDetails((prevUserDetails) => ({
        ...prevUserDetails,
        status: "Not Approved",
      }));
      toast.error("Details not approved!"); // Set the failure message
    } catch (error) {
      console.error("Error not approving user details:", error);
    }
  };

  return (
    <div className="div1">
      <h2 className="userD">User Details</h2>
      {userDetails && (
        <div>
          <h3>Skills</h3>
          {loading ? (
            <TableSkeleton numColumns={1} numRows={1} />
          ) : userDetails.skills && userDetails.skills.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="table-header">Skill Name</th>
                  <th className="table-header">Proficiency Level</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.skills.map((skill, index) => (
                  <React.Fragment key={index}>
                    {skill.status === "pending" && (
                      <tr>
                        <td>{skill.skillname}</td>
                        <td>{skill.proficiencylevel}</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No skills found</p>
          )}

          <h3>Projects</h3>
          {loading ? (
           <TableSkeleton numColumns={2} numRows={2} />
          ) : userDetails.projects && userDetails.projects.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="table-header">Project Name</th>
                  <th className="table-header">Project Description</th>
                  <th className="table-header">Project Experience</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.projects.map((project, index) => (
                  <React.Fragment key={index}>
                    {project.status === "pending" && (
                      <tr>
                        <td>{project.projectname}</td>
                        <td>{project.projectdescription}</td>
                        <td>{project.projectexperience}</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No projects found</p>
          )}

          <h3>Certifications</h3>
          {loading ? (
            <TableSkeleton numColumns={2} numRows={2} />
          ) : userDetails.certifications && userDetails.certifications.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="table-header">Certification Name</th>
                  <th className="table-header">Certification File</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.certifications.map((certification, index) => (
                  <React.Fragment key={index}>
                    {certification.status === "pending" && (
                      <tr>
                        <td>{certification.certificationname}</td>
                        <td>{certification.certificationfile}</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No certifications found</p>
          )}
          
          <div className="button-container">
            <Button
              className="approve"
              onClick={handleApprove}
              style={{
                marginRight: "10px",
                backgroundColor: "green",
                color: "white",
              }}
            >
              Approve
            </Button>
            <Button
              className="not-approve"
              onClick={handleNotApprove}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Not Approve
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
