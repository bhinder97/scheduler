import React from "react";
import { render, cleanup, fireEvent, queryByText } from "@testing-library/react";
import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      student: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(<Form interviewers={interviewers} />);
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} student="Sylvia Palmer"/>
    )
    expect(getByTestId("student-name-input")).toHaveValue("Sylvia Palmer");
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();
    const {getByText} = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );

    fireEvent.click(getByText("Save"));

    expect(getByText("Please enter a name.")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  })

  it("validates that the interviewer cannot be null", () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form
        student="Bob"
        interviewers={interviewers}
        interviewer={null}
        onSave={onSave}
      />
    )
    fireEvent.click(getByText("Save"));
    expect(getByText("Please enter an interviewer.")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("call onSave function when the name is defined", () => {
    const onSave = jest.fn();
    const { queryByText, getByText } = render (
      <Form interviewers={interviewers} student="Lydia Miller-Jones" interviewer={1} onSave={onSave} />
    )
    fireEvent.click(getByText("Save"))
    expect(queryByText("Please enter a name.")).toBeNull();
    expect(queryByText("Please enter an interviewer.")).toBeNull();

    expect(onSave).toHaveBeenCalledTimes(1);

    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("submits the name entered by the user", () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <Form interviewers={interviewers} onSave={onSave} interviewer={1} />
    );
  
    const input = getByPlaceholderText("Enter Student Name");
  
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });
    fireEvent.click(getByText("Save"));
  
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} interviewer={1} />
    );
  
    fireEvent.click(getByText("Save"));
  
    expect(getByText(/Please enter a name./i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    fireEvent.click(getByText("Save"));
  
    expect(queryByText(/Please enter a name./i)).toBeNull();
  
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("calls onCancel and resets the input field", () => {
  const onCancel = jest.fn();
  const { getByText, getByPlaceholderText, queryByText } = render(
    <Form
      interviewers={interviewers}
      name="Lydia Mill-Jones"
      onSave={jest.fn()}
      onCancel={onCancel}
    />
  );

  fireEvent.click(getByText("Save"));

  fireEvent.change(getByPlaceholderText("Enter Student Name"), {
    target: { value: "Lydia Miller-Jones" }
  });

  fireEvent.click(getByText("Cancel"));

  expect(queryByText(/student name cannot be blank/i)).toBeNull();

  expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");

  expect(onCancel).toHaveBeenCalledTimes(1);
});

});