import { CardActionArea, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSubject } from "../redux/activeSubject";

function SubjectPlate() {
  const subjects = useSelector((state) => state.subjectsSlice);

  const dispatch = useDispatch();
  const activeSubject = useSelector((state) => state.activeSubject);
  return (
    <div className="pt-4">
      <div className="row">
        {subjects.map((c, i) => (
          <div
            key={i}
            className="col-lg-3 p-0 m-1 rounded"
            style={
              activeSubject.code === c.code
                ? { backgroundColor: "#84AE92", color: "#fefefe" }
                : { backgroundColor: "#FAF7F3", color: "#212121" }
            }
          >
            <CardActionArea
              className="p-2 text-break"
              onClick={() => dispatch(setActiveSubject(c))}
            >
              <Typography fontWeight={700} textTransform={"capitalize"}>
                {c.name}
              </Typography>

              <Typography variant="caption" textTransform={"uppercase"}>
                {c.code}
              </Typography>
            </CardActionArea>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectPlate;
