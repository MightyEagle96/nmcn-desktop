import { Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import CalculateIcon from "@mui/icons-material/Calculate";

function CalculatorFunction() {
  const [text, setText] = useState("0");
  const operators = ["+", "-", "*", "/"];

  const handleInput = (value: string) => {
    const lastChar = text[text.length - 1];
    if (text === "0") {
      if (["+", "/", "*"].includes(value)) return;
      setText(value);
      return;
    }
    if (operators.includes(lastChar) && operators.includes(value)) return;
    setText(text + value);
  };

  const resetText = () => setText("0");

  const calculateData = () => {
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${text})`)();
      setText(result.toString());
    } catch {
      setText("Error");
    }
  };

  // ✅ Only attach keyboard listener once
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (
        (e.key >= "0" && e.key <= "9") ||
        operators.includes(e.key) ||
        e.key === "."
      ) {
        handleInput(e.key);
      } else if (e.key === "Enter") {
        e.preventDefault();
        calculateData();
      } else if (e.key === "Backspace") {
        setText((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      } else if (e.key === "Escape") {
        resetText();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // no dependency

  return (
    <div className="p-4 border rounded shadow bg-white w-64">
      <div className="p-3 border border-2 rounded text-end mb-3">
        <Typography variant="h6">{text}</Typography>
      </div>

      {[
        ["7", "8", "9", "+"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "*"],
        ["AC", "0", ".", "/"],
      ].map((row, idx) => (
        <div key={idx} className="d-flex justify-content-between mb-2">
          {row.map((val) => (
            <Button
              key={val}
              variant="contained"
              color={
                val === "AC"
                  ? "error"
                  : operators.includes(val)
                    ? "warning"
                    : "primary"
              }
              onClick={() => {
                if (val === "AC") resetText();
                else handleInput(val);
              }}
            >
              {val}
            </Button>
          ))}
        </div>
      ))}

      <div className="text-center">
        <Button
          color="success"
          variant="contained"
          onClick={calculateData}
          fullWidth
        >
          =
        </Button>
      </div>
    </div>
  );
}

export default function ShowCalculator() {
  const [showCalc, setShowCalc] = useState(false);

  return (
    <div>
      <Button
        endIcon={<CalculateIcon />}
        variant="contained"
        onClick={() => setShowCalc(true)}
      >
        Calculator
      </Button>

      <Modal show={showCalc} onHide={() => setShowCalc(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Calculator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CalculatorFunction />
        </Modal.Body>
      </Modal>
    </div>
  );
}
