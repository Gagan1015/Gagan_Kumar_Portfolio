import { GoogleGenAI, Chat } from "@google/genai";
import { profileService, experienceService, educationService, projectService, skillService } from './portfolioService';

const API_KEY = process.env.API_KEY || '';

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient && API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
};

const buildSystemInstruction = async () => {
  try {
    // Fetch only essential data with shorter timeout
    const profile = await profileService.getProfile();
    
    // Fetch other data in background, use empty arrays if they fail
    let experiences: any[] = [];
    let projects: any[] = [];
    let education: any[] = [];
    let skillsGrouped: any = {};
    
    try {
      [experiences, projects, education, skillsGrouped] = await Promise.all([
        experienceService.getAll(),
        projectService.getAll(),
        educationService.getAll(),
        skillService.getGrouped()
      ]);
    } catch (err) {
      console.warn('Some data failed to load, using partial data for chat');
    }

    // Convert grouped skills to string
    const skillsText = Object.entries(skillsGrouped as Record<string, any[]>)
      .map(([category, skills]) => `- ${category}: ${skills.map(s => s.name).join(', ')}`)
      .join('\n') || 'Skills loading...';

    return `
You are ${profile.full_name}'s professional portfolio assistant. You help visitors learn about ${profile.full_name}'s work and how to connect with them.

When visitors ask how to contact ${profile.full_name}, you should provide the following PUBLIC contact details that are displayed on this portfolio website:

📧 Email: ${profile.email}
📱 Phone: ${profile.phone || 'Available on request'}
📍 Location: ${profile.location || 'Remote'}

Professional Links:
🔗 GitHub: ${profile.github_url || 'Not available'}
🔗 LinkedIn: ${profile.linkedin_url || 'Not available'}  
🔗 Twitter: ${profile.twitter_url || 'Not available'}

About ${profile.full_name}:
${profile.bio || profile.summary || ''}
⏱️ ${profile.years_of_experience || 'N/A'} years of experience

Technical Skills:
${skillsText}

Work Experience:
${experiences.length > 0 ? experiences.map(e => `• ${e.position} at ${e.company} (${e.start_date} - ${e.end_date || 'Present'})\n  ${e.description || ''}\n  Technologies: ${e.technologies?.join(', ') || 'N/A'}`).join('\n\n') : 'Check the experience section on the website'}

Featured Projects:
${projects.length > 0 ? projects.slice(0, 5).map(p => `• ${p.title} - ${p.description || ''}\n  Tech: ${p.technologies?.join(', ') || 'N/A'}`).join('\n\n') : 'Check the projects section on the website'}

Education:
${education.length > 0 ? education.map(e => `• ${e.degree}, ${e.institution} (${e.end_date || e.start_date})`).join('\n') : 'Check the education section on the website'}

How to respond:
- Be friendly, professional, and helpful
- Keep responses concise (2-3 sentences)
- When asked for contact info, provide the email/phone/links listed above
- Example: "You can reach ${profile.full_name} at ${profile.email} or call at ${profile.phone}. Feel free to also connect on LinkedIn!"
- Focus on ${profile.full_name}'s skills and experience when discussing technical topics
`;
  } catch (error) {
    console.error('Error building system instruction:', error);
    return `You are a helpful AI assistant for a portfolio website. Answer questions professionally and concisely.`;
  }
};

export const createChatSession = async (): Promise<Chat | null> => {
  const client = getClient();
  if (!client) {
    console.error('Gemini client not initialized - missing API key');
    return null;
  }

  try {
    const systemInstruction = await buildSystemInstruction();
    console.log('Creating chat session with system instruction');

    return client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      }
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return null;
  }
};