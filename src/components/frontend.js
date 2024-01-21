import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Nav from './nav';
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
function Frontend() {
  const [pretty, setPretty] = useState([]); // pretty is now an array
  const [formData, setFormData] = useState({});
  const [textareaValue, setTextareaValue] = useState('');
  const navigate = useNavigate();
  
  const handleInputChange = (jsonKey, key, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [jsonKey]: value, [key]: value };
  
      const setDefaultValues = (elements, parentKey) => {
        elements.forEach((element) => {
          const currentKey = parentKey ? `${parentKey}.${element.jsonKey}` : element.jsonKey;
  
          if (element.uiType === 'Group') {
            setDefaultValues(element.subParameters, currentKey);
          } else if (!updatedData[currentKey]) {
            updatedData[currentKey] = element.validate.defaultValue; // You can set a default value if needed
          }
        });
      };
  
      // Set default values for group elements
      setDefaultValues(pretty, '');
  
      return updatedData;
    });
  };
  
  

  const sendObject=()=>{
    console.log("HI");
    navigate('/profile',{state: formData});
    // return formData;
  }

  const RenderingArrayOfObjects = () => {
    const renderNestedGroups = (subParameters, level, prevparam) => {
      return subParameters.map((subElement) => (
        <div className="form-group" key={subElement.jsonKey}>
          <Form.Group className="mb-3" controlId={`form-${subElement.jsonKey}`}>
            {subElement.description && (
              <OverlayTrigger
                trigger="hover"
                key="right"
                placement="right"
                overlay={
                  <Popover id={`popover-positioned-right`}>
                    <Popover.Header as="h3">{subElement.label}</Popover.Header>
                    <Popover.Body>{subElement.description}</Popover.Body>
                  </Popover>
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
              </OverlayTrigger>
            )}
            {renderFormElement(subElement, prevparam)}
          </Form.Group>
        </div>
      ));
    };

    const renderFormElement = (element, prevparam) => {
      const key = prevparam ? `${prevparam}.${element.jsonKey}` : element.jsonKey;
      switch (element.uiType) {
        case 'Input':
          return (
            <Form.Control
              type="text"
              onChange={(e) => {
                handleInputChange(key, element.jsonKey, e.target.value);
              }}
              value={formData[key]}
              placeholder={element.placeholder}
              disabled={element.disable}
              required={element.validate.required}
            />
          );
        case 'Number':
          return (
            <Form.Control
              type="number"
              onChange={(e) => {
                handleInputChange(key, element.jsonKey, e.target.value);
              }}
              placeholder={element.placeholder}
              disabled={element.validate?.immutable || false}
              required={element.validate.required}
            />
          );
        case 'Select':
          return (
            <Form.Select
              value={formData[key]}
              onChange={(e) => {
                handleInputChange(key, element.jsonKey, e.target.value);
              }}
              required={element.validate.required}
              disabled={element.disable}
            >
              {element.validate?.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          );
        // ... (other cases)
        case 'Switch':
                console.log(element);
                return (
                  <Form.Check
                    type="switch"
                    // id={`switch-${key}`}
                    checked={formData[key]}
                    onChange={(e) => {handleInputChange(key, element.jsonKey, !formData[key]);}}
                    label={element.label}
                    required={element.validate.required}
                    disabled={element.validate?.immutable || false}
                  />
                );
          
              case 'Radio':
                return (
                  <div>
                    {element.validate?.options?.map((option) => (
                      <Form.Check
                        key={option.value}
                        type="radio"
                        id={`radio-${key}-${option.value}`}
                        label={option.label}
                        onChange={(e) => {handleInputChange(key, element.jsonKey,e.target.value);}}
                        name={key}
                        required={element.validate.required}
                        value={option.value}
                        checked={formData[key] === option.value}
                        disabled={element.validate?.immutable || false}
                      />
                    ))}
                </div>
              );
            case 'Group':
              return renderNestedGroups(element.subParameters, element.level, element.jsonKey);
            case 'Ignore':
                const shouldRender = element.conditions.every(condition => {
                    const { jsonKey, op, value } = condition;
                    // You might need to fetch the actual value from the form data
                    const actualValue = formData[jsonKey]; // Replace with actual value retrieval logic
                    console.log(formData);
                    console.log(jsonKey);
                    console.log(actualValue);
                    console.log(value);
                    switch (op) {
                      case '==':
                        return actualValue === value;
                      // Add more comparison cases as needed
                      default:
                        return false;
                    }
                });
                return shouldRender ? renderNestedGroups(element.subParameters, element.level, "") : null;
        default:
          return null;
      }
    };

    const listItems = pretty.map((element) => (
      <div className="form-group" key={element.jsonKey}>
        <Form.Group className="mb-3" controlId={`form-${element.jsonKey}`}>
          <Form.Label>{element.label}</Form.Label>{" "}
          {element.description && (
            <OverlayTrigger
              trigger="hover"
              key="right"
              placement="right"
              overlay={
                <Popover id={`popover-positioned-right`}>
                  <Popover.Header as="h3">{element.label}</Popover.Header>
                  <Popover.Body>{element.description}</Popover.Body>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
            </OverlayTrigger>
          )}
          {renderFormElement(element)}
          {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
        </Form.Group>
      </div>
    ));

    return <div className="container">{listItems}</div>;
  };

  const handlePrettyPrint = () => {
    try {
      const ugly = textareaValue;
      if (ugly) {
        const obj = JSON.parse(ugly);
        setPretty(obj); // Update state as an array
        RenderingArrayOfObjects();
      }
    } catch (error) {
      console.error('Error parsing JSON:', error.message);
    }
  };

  return (
    <div style= {{"background": "#292929" }}className="text-white">
    <Nav />
      <div className="container">
        <div className="row text-center">
          {/* ... (other components) */}
          
          <div className="col-md-6">
            <div className="row m-4 text-center" style={{ textAlign: "center" }}>
              <strong>ENTER YOUR JSON CODE FOR UI-SCHEMA HERE</strong>
            </div>
            <label>
              <textarea
                id="myTextArea"
                name="postContent"
                placeholder="Give JSON format of the dynamic form you need to create"
                rows={22}
                cols={70}
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
              />
            </label>
            <div className="row m-4 text-center" style={{ textAlign: "center" }}>
                <Button variant="secondary" onClick={handlePrettyPrint}>
                    Submit
                </Button>{" "}
            </div>
            
          </div>
          <div className="col-md-6">
            <div className="row m-4 text-center" style={{ textAlign: "center" }}>
              <strong>FORM GENERATED</strong>
            </div>
            {RenderingArrayOfObjects()}
            <div className="row m-4 text-center" style={{ textAlign: "center" }}>
                <Button variant="secondary" onClick={sendObject}>
                    Submit
                </Button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Frontend;
