export interface Lead {
    _id?: string;
    name: string;
    email: string;
    status: string;
    createdAt?: string;
  }
  
  export const addLead = async (leadData: Lead): Promise<Lead | { error: string }> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to add lead");
      }
  
      return data;
    } catch (error) {
      console.error("Error:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  };
  
  export const getLeads = async (): Promise<Lead[] | { error: string }> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`);
  
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  };
  