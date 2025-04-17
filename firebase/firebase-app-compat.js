// Firebase App (the core Firebase SDK)
const firebase = {
  _config: null,
  
  initializeApp: function(config) {
    this._config = config;
    console.log('Firebase initialized with config:', config);
    return this;
  },
  
  firestore: function() {
    return {
      collection: function(path) {
        console.log('Accessing collection:', path);
        return {
          doc: function(id) {
            console.log('Accessing document:', id);
            return {
              set: async function(data) {
                try {
                  // For Realtime Database, we don't need the auth parameter with public access
                  const url = `${firebase._config.databaseURL}/blockedUsernames/${id}.json`;
                  
                  console.log('Sending data to:', url, data);
                  
                  const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
                  
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  
                  console.log('Document set successfully:', id, data);
                  return response.json();
                } catch (error) {
                  console.error('Error setting document:', error);
                  throw error;
                }
              }
            };
          },
          
          onSnapshot: function(callback) {
            console.log('Setting up snapshot listener for:', path);
            
            // Set up polling to simulate real-time updates
            const pollInterval = 5000; // Poll every 5 seconds
            
            // Initial fetch
            const url = `${firebase._config.databaseURL}/blockedUsernames.json`;
            
            console.log('Fetching data from:', url);
            
            fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                console.log('Received data:', data);
                
                // Convert object to array of usernames
                const usernames = data ? Object.values(data).map(item => item.username) : [];
                console.log('Extracted usernames:', usernames);
                
                callback({
                  forEach: (fn) => {
                    usernames.forEach(username => {
                      fn({ data: () => ({ username }) });
                    });
                  }
                });
              })
              .catch(error => {
                console.error('Error fetching data:', error);
                callback({
                  forEach: () => {} // Empty callback on error
                });
              });
            
            // Set up polling
            const intervalId = setInterval(() => {
              console.log('Polling for updates...');
              
              fetch(url)
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
                })
                .then(data => {
                  console.log('Received updated data:', data);
                  
                  // Convert object to array of usernames
                  const usernames = data ? Object.values(data).map(item => item.username) : [];
                  console.log('Extracted updated usernames:', usernames);
                  
                  callback({
                    forEach: (fn) => {
                      usernames.forEach(username => {
                        fn({ data: () => ({ username }) });
                      });
                    }
                  });
                })
                .catch(error => {
                  console.error('Error polling data:', error);
                });
            }, pollInterval);
            
            // Return a function to unsubscribe
            return () => clearInterval(intervalId);
          }
        };
      }
    };
  }
};

window.firebase = firebase; 