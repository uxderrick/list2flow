import {
  Button,
  Columns,
  Container,
  Muted,
  render,
  Text,
  TextboxNumeric,
  IconLayerFrame16,
  Textbox,
  VerticalSpace,
  Link,
} from "@create-figma-plugin/ui";
import { Plus } from "@phosphor-icons/react";

import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState, useEffect, useRef } from "preact/hooks";

import { CloseHandler, CreateRectanglesHandler } from "./types";
import styles from "./styles.css";

function Plugin() {
  const [itemValue, setItemValue] = useState("");
  const [numberOfTextboxes, setNumberOfTextboxes] = useState(1);
  const [items, setItems] = useState<string[]>([""]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const latestTextboxRef = useRef<HTMLInputElement | null>(null);

  const addTextbox = () => {
    if (items.length < 8) {
      setItems([...items, ""]);
    }
  };

  const removeTextbox = () => {
    setItems(items.slice(0, -1));
  };

  const clearAllTextboxes = () => {
    setItems([""]);
  };

  const handleItemChange = (
    index: number,
    value: string,
    isEnterPressed: boolean = false
  ) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);

    if (isEnterPressed && index === items.length - 1 && items.length < 8) {
      addTextbox();
    }
  };

  useEffect(() => {
    if (latestTextboxRef.current) {
      latestTextboxRef.current.focus();
    }
  }, [items.length]); // This effect runs when the number of items changes

  const arrayOfTextboxes = items.map((item, index) => (
    <div key={index}>
      <Textbox
        ref={index === items.length - 1 ? latestTextboxRef : null}
        icon={<IconLayerFrame16 />}
        onValueInput={(value) => handleItemChange(index, value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleItemChange(index, event.currentTarget.value, true);
          }
        }}
        placeholder="Enter item here..."
        value={item}
        variant="border"
        style={{
          width: "100%",
        }}
        maxLength={30}
      />
      <VerticalSpace space="extraSmall" />
    </div>
  ));

  const handleCreateRectanglesButtonClick = useCallback(
    function () {
      const hasEmptyItem = items.some((item) => item.trim() === "");
      if (hasEmptyItem) {
        setErrorMessage("All fields must be filled out.");
        return;
      }
      setErrorMessage(null);
      emit<CreateRectanglesHandler>("CREATE_RECTANGLES", items);
    },
    [items]
  );

  useEffect(() => {
    // Adjust the plugin height to fit the content
    if (typeof parent !== "undefined") {
      parent.postMessage(
        { pluginMessage: { type: "resize", size: document.body.scrollHeight } },
        "*"
      );
    }
  }, []);

  return (
    <div className={styles.pluginContainer}>
      <Container space="small">
        <VerticalSpace space="large" />
        <Text>
          <Muted>Items</Muted>
        </Text>
        <VerticalSpace space="small" />
        {/* text boxes */}
        {arrayOfTextboxes}
        {errorMessage && (
          <div>
            <Text
              style={{
                color: "yellow",
                marginTop: "8px",
                textAlign: "left",
              }}
            >
              {errorMessage}
            </Text>
            <VerticalSpace space="small" />
          </div>
        )}
        {/* <VerticalSpace space="small" /> */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {arrayOfTextboxes.length > 1 ? (
            <div>
              <Button
                secondary
                style={{
                  height: 28,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  borderRadius: 2,
                  border: "1px solid #444",
                }}
                onClick={clearAllTextboxes}
              >
                Clear all
              </Button>
              <Button
                secondary
                style={{
                  height: 28,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  borderRadius: 2,
                  border: "1px solid #444",
                }}
                onClick={removeTextbox}
              >
                Remove row
              </Button>
            </div>
          ) : null}
          {arrayOfTextboxes.length < 9 ? (
            <Button
              secondary
              style={{
                height: 28,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                borderRadius: 2,
                border: "1px solid #444",
              }}
              onClick={addTextbox}
            >
              Add row
            </Button>
          ) : null}
        </div>

        <VerticalSpace space="extraLarge" />
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 16,
            right: 16,
          }}
        >
          <Columns space="extraSmall">
            <Button
              fullWidth
              onClick={handleCreateRectanglesButtonClick}
              {...{ disabled: items.length < 2 }}
            >
              Generate flow
            </Button>
          </Columns>
          <VerticalSpace space="large" />
          <Text
            align="center"
            style={{
              color: "#999",
              fontSize: 10,
            }}
          >
            {`With ❤️ by`}{" "}
            <Link href="https://github.com/uxderrick" target="_blank">
              UXDerrick
            </Link>
          </Text>
        </div>
        <VerticalSpace space="small" />
      </Container>
    </div>
  );
}

export default render(Plugin);
