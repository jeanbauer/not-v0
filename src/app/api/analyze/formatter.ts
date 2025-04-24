// Enhanced code extraction and fixing function for your API handler
export const formatter = (response: string) => {
  // Look for code between triple backticks
  const codeBlockRegex = /```(?:jsx?|tsx?|react)?\s*([\s\S]*?)```/;
  const match = response.match(codeBlockRegex);

  let code = match && match[1] ? match[1].trim() : response;

  // Fix common syntax errors coming from the LLM
  // Pattern 1: const Component = const X = ...
  const nestedConstPattern = /const\s+(\w+)\s*=\s*const\s+(\w+)\s*=/g;
  if (nestedConstPattern.test(code)) {
    // Replace with proper structure
    code = code.replace(nestedConstPattern, (match, name1, name2) => {
      // If name1 is "Component", we'll assume that's our main component
      if (name1.toLowerCase() === "component") {
        return `const ${name2} =`;
      } else {
        return `const ${name1} = () => {\n  return <${name2} />;\n};\n\nconst ${name2} =`;
      }
    });
  }

  // Fix doubled semicolons
  code = code.replace(/;;/g, ";");

  // Ensure render statement points to an existing component
  // If we have render(<Component />) but no Component defined, find a likely component
  // if (
  //   code.includes("render(<Component />)") &&
  //   !code.includes("const Component =")
  // ) {
  //   const componentNameMatch = code.match(/const\s+(\w+)\s*=/);
  //   if (componentNameMatch && componentNameMatch[1]) {
  //     const lastComponentName = componentNameMatch[1];
  //     code = code.replace(
  //       "render(<Component />)",
  //       `render(<${lastComponentName} />)`
  //     );
  //   }
  // }



  return code;
};
