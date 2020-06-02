import React from "react";
import Modal from "@material-ui/core/Modal";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const CancelModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => any;
}) => {
  const classes = useModalStyles();
  return (
    <Modal open={open} onClose={handleClose}>
      <Container classes={{ root: classes.root }}>
        <Typography classes={{ root: classes.text }}>
          Are you sure you want to cancel this event?
        </Typography>
      </Container>
    </Modal>
  );
};

const useModalStyles = makeStyles({
  root: {
    position: "absolute",
    left: "0%",
    right: "0%",
    top: "0%",
    bottom: "0%",
    color: "#FFFFFF",

    background: "#FFFFFF",
    border: "1.35101px solid #C4C4C4",
    boxSizing: "border-box",
    borderRadius: "5px",
    width: "332px",
    height: "182px",
    margin: "auto",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
});

export default CancelModal;
