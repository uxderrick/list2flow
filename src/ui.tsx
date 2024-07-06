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
import { useCallback, useState, useEffect } from "preact/hooks";

import { CloseHandler, CreateRectanglesHandler } from "./types";
import styles from "./styles.css";

function Plugin() {
  const [count, setCount] = useState<number | null>(5);
  const [countString, setCountString] = useState("5");
  const [numberOfTextboxes, setNumberOfTextboxes] = useState(1);

  const addTextbox = () => {
    setNumberOfTextboxes(numberOfTextboxes + 1);
  };

  const removeTextbox = () => {
    setNumberOfTextboxes(numberOfTextboxes - 1);
  };

  const arrayOfTextboxes = Array.from({ length: numberOfTextboxes }, (_, i) => (
    <div>
      <Textbox
        icon={<IconLayerFrame16 />}
        onValueInput={setCountString}
        value={countString}
        variant="border"
        style={{
          width: "100%",
        }}
      />
      <VerticalSpace space="extraSmall" />
    </div>
  ));

  const handleCreateRectanglesButtonClick = useCallback(
    function () {
      if (count !== null) {
        emit<CreateRectanglesHandler>("CREATE_RECTANGLES", count);
      }
    },
    [count]
  );
  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

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
        {/* <VerticalSpace space="small" /> */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {numberOfTextboxes > 1 ? (
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
          ) : null}
          {numberOfTextboxes < 8 ? (
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
            <Button fullWidth onClick={handleCreateRectanglesButtonClick}>
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
