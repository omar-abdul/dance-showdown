const setRandomPrompt = () => {
  const prompts = ["up", "down", "left", "right"];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return randomPrompt;
};

export { setRandomPrompt };
