// Helper function to convert entries to markdown
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        
        let header = `### ${entry.title}`;
        if (entry.organization) {
          header += ` | ${entry.organization}`;
        }

        let description = "";
        if (entry.description) {
          description = `\n\n${entry.description}`;
        }
        
        return `${header}\n${dateRange}${description}`;
      })
      .join("\n\n")
  );
}
