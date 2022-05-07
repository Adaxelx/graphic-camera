const Helpers = () => {
  const getKeyboardConfig = () => {
    const rotationStep = 0.1;
    const translationStep = 10;
    const zoomStep = 0.1;
    return {
      rotation: {
        x: [
          { keys: ["ArrowUp"], value: rotationStep },
          { keys: ["ArrowDown"], value: -rotationStep },
        ],
        y: [
          { keys: ["ArrowRight"], value: rotationStep },
          { keys: ["ArrowLeft"], value: -rotationStep },
        ],
        z: [
          { keys: ["q", "Q"], value: -rotationStep },
          { keys: ["e", "E"], value: rotationStep },
        ],
      },
      translation: {
        x: [
          { keys: ["a", "A"], value: -translationStep },
          { keys: ["d", "D"], value: translationStep },
        ],

        y: [
          { keys: ["w", "W"], value: -translationStep },
          { keys: ["s", "S"], value: translationStep },
        ],

        z: [
          { keys: ["z", "Z"], value: -translationStep },
          { keys: ["x", "X"], value: translationStep },
        ],
      },
      zoom: {
        value: [
          { keys: ["o", "O"], value: zoomStep },
          { keys: ["p", "P"], value: -zoomStep },
        ],
      },
    };
  };

  const keyboardConfig = getKeyboardConfig();

  const createListOfKeys = () => {
    const container = document.createElement("aside");

    Object.entries(keyboardConfig).forEach(([actionName, configs]) => {
      const wrapper = document.createElement("div");
      const header = document.createElement("h2");
      header.textContent = actionName;
      wrapper.appendChild(header);
      Object.entries(configs).forEach(([configName, options]) => {
        const operationNode = document.createElement("h3");
        operationNode.textContent = `${configName}`;
        wrapper.appendChild(operationNode);
        options.forEach((option) => {
          let content = "Keys: ";
          content = option.keys.reduce((prevContent, key, index) => {
            console.log(index, option.keys.length);
            const separator = index === option.keys.length - 1 ? " " : " or ";
            return prevContent + key + separator;
          }, content);
          const keyNode = document.createElement("p");
          content += `/ change: ${option.value}`;
          keyNode.textContent = content;
          wrapper.appendChild(keyNode);
        });
      });
      container.appendChild(wrapper);
    });

    document.getElementById("root").appendChild(container);
  };

  return {
    keyboardConfig,
    createListOfKeys,
  };
};
