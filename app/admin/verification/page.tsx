'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle, User, Building, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Types
interface UserInfo {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

interface VerificationRequest {
  _id: string;
  userId: UserInfo;
  type: 'agent' | 'builder';
  status: 'pending' | 'approved' | 'rejected';
  requestDetails?: {
    licenseNumber?: string;
    agency?: string;
    experience?: number;
    specializations?: string[];
    languages?: string[];
    companyName?: string;
    established?: string;
    headquarters?: string;
    specialization?: string;
    additionalInfo?: string;
  };
  documents?: string[];
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  agentInfo: {
    licenseNumber?: string;
    agency?: string;
    experience?: number;
    specializations?: string[];
    languages?: string[];
    rating?: number;
    reviewCount?: number;
    verified: boolean;
    listings?: number;
    sales?: number;
  };
  lastActive?: string;
}

interface Builder {
  _id: string;
  title: string;
  image: string;
  logo: string;
  projects: number;
  description: string;
  established: string;
  headquarters: string;
  specialization: string;
  rating: number;
  completed: number;
  ongoing: number;
}

export default function VerificationAdmin() {
  const {status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<VerificationRequest[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    // Only run this on the client side
    if (typeof window !== 'undefined') {
      const authToken = sessionStorage.getItem("authToken");
      if (authToken) {
        setToken(authToken);
      }
    }
  }, []);

  useEffect(() => {
    if(!token) {
      toast.error("Please login to proceed!! Redirecting to home page!")
      setTimeout(() => {
      router.push("/")
      }, 1500)
    }
  }, [token, router])
  useEffect(() => {
    fetchRequests();
    fetchAgents();
    fetchBuilders();
  }, []);

  // Fetch verification requests
  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests?status=pending',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPendingRequests(data.requests);
      } else {
        toast.error(data.error || 'Failed to fetch verification requests');
      }
    } catch (error) {
      toast.error(`Failed to process request: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch verified agents
  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      if (response.ok) {
        setAgents(data.agents);
      }
    } catch (error) {
      toast.error(`Failed to process request: ${error}`);
    }
  };

  // Fetch verified builders
  const fetchBuilders = async () => {
    try {
      const response = await fetch('/api/builders');
      const data = await response.json();
      if (response.ok) {
        setBuilders(data.builders);
      }
    } catch (error) {
      toast.error(`Failed to process request: ${error}`);
    }
  };

  // Handle accepting a verification request
  const handleAccept = async (id: string) => {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/requests/${id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification request accepted');

        // Refresh data
        fetchRequests();
        fetchAgents();
        fetchBuilders();
      } else {
        toast.error(data.error || 'Failed to accept request');
      }
    } catch (error) {
      toast.error(`Failed to process request: ${error}`);
    } finally {
      setLoadingId(null);
    }
  };

  // Handle rejecting a verification request
  const handleReject = async (id: string) => {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/requests/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification request rejected');

        // Remove from the list
        setPendingRequests(pendingRequests.filter(req => req._id !== id));
      } else {
        toast.error(data.error || 'Failed to reject request');
      }
    } catch (error) {
      toast.error(`Failed to process request: ${error}`);
    } finally {
      setLoadingId(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 bg-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-orange-500">Verification Management</h1>

      <Tabs defaultValue="requests">
        <TabsList className="mb-8 border-b border-orange-500">
          <TabsTrigger value="requests" className="flex items-center gap-2 text-orange-500 border-b-2 border-transparent hover:border-orange-500">
            <AlertCircle className="h-4 w-4" />
            Pending Requests
            {pendingRequests.length > 0 && (
              <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2 text-orange-500 border-b-2 border-transparent hover:border-orange-500">
            <User className="h-4 w-4" />
            Verified Agents
          </TabsTrigger>
          <TabsTrigger value="builders" className="flex items-center gap-2 text-orange-500 border-b-2 border-transparent hover:border-orange-500">
            <Building className="h-4 w-4" />
            Verified Builders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <div className="bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-orange-500">Pending Verification Requests</h2>

              {pendingRequests.length === 0 ? (
                <div className="text-center py-12 bg-gray-700 rounded-lg">
                  <p className="text-gray-400">No pending verification requests found.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {pendingRequests.map((request) => (
                    <div key={request._id} className="border rounded-lg p-6 bg-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-600">
                            {request.userId.image ? (
                              <Image
                                src={request.userId.image}
                                alt={request.userId.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <User className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-orange-500">{request.userId.name}</h3>
                            <p className="text-sm text-gray-400">{request.userId.email}</p>
                            {request.userId.phone && (
                              <p className="text-sm text-gray-400">{request.userId.phone}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.type === 'agent'
                              ? 'bg-blue-600 text-white'
                              : 'bg-purple-600 text-white'
                          }`}>
                            {request.type === 'agent' ? 'Agent Request' : 'Builder Request'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {request.requestDetails && (
                        <div className="mt-4 p-4 bg-gray-800 rounded-md">
                          <h4 className="font-medium mb-2 text-orange-500">Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {request.type === 'agent' ? (
                              <>
                                {request.requestDetails.licenseNumber && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-400">License Number</p>
                                    <p className="text-white">{request.requestDetails.licenseNumber}</p>
                                  </div>
                                )}
                                {request.requestDetails.agency && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-400">Agency</p>
                                    <p className="text-white">{request.requestDetails.agency}</p>
                                  </div>
                                )}
                                {request.requestDetails.experience && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-400">Experience (years)</p>
                                    <p className="text-white">{request.requestDetails.experience}</p>
                                  </div>
                                )}
                                {request.requestDetails.specializations && request.requestDetails.specializations.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-400">Specializations</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {request.requestDetails.specializations.map((spec, index) => (
                                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-600 text-white">
                                          {spec}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {request.requestDetails.languages && request.requestDetails.languages.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-400">Languages</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {request.requestDetails.languages.map((lang, index) => (
                                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-600 text-white">
                                          {lang}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                {request.requestDetails.companyName && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-400">Company Name</p>
                                    <p className="text-white">{request.requestDetails.companyName}</p>
                                  </div>
                                )}
                                {request.requestDetails.established && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-400">Established</p>
                                    <p className="text-white">{request.requestDetails.established}</p>
                                  </div>
                                )}
                                {request.requestDetails.headquarters && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-400">Headquarters</p>
                                    <p className="text-white">{request.requestDetails.headquarters}</p>
                                  </div>
                                )}
                                {request.requestDetails.specialization && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-400">Specialization</p>
                                    <p className="text-white">{request.requestDetails.specialization}</p>
                                  </div>
                                )}
                              </>
                            )}
                            {request.requestDetails.additionalInfo && (
                              <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-400">Additional Information</p>
                                <p className="text-sm text-white">{request.requestDetails.additionalInfo}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {request.documents && request.documents.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2 text-orange-500">Documents</h4>
                          <div className="flex flex-wrap gap-2">
                            {request.documents.map((doc, index) => (
                              <a
                                key={index}
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-500 bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Document {index + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex gap-3 justify-end">
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(request._id)}
                          disabled={loadingId === request._id}
                          className="gap-2 bg-red-500 text-white hover:bg-red-600"
                        >
                          {loadingId === request._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleAccept(request._id)}
                          disabled={loadingId === request._id}
                          className="gap-2 bg-green-500 text-white hover:bg-green-600"
                        >
                          {loadingId === request._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-500">Verified Agents</h2>

            {agents.length === 0 ? (
              <div className="text-center py-12 bg-gray-700 rounded-lg">
                <p className="text-gray-400">No verified agents found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div key={agent._id} className="border rounded-lg p-6 bg-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                        {agent.image ? (
                          <Image
                            src={agent.image}
                            alt={agent.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-10 w-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-orange-500">{agent.name}</h3>
                        <p className="text-sm text-gray-400">{agent.email}</p>
                        {agent.agentInfo.agency && (
                          <p className="text-sm text-white">{agent.agentInfo.agency}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      {agent.agentInfo.rating !== undefined && (
                        <div>
                          <p className="text-gray-400 font-medium">Rating</p>
                          <p className="text-white">{agent.agentInfo.rating.toFixed(1)} / 5</p>
                        </div>
                      )}
                      {agent.agentInfo.experience !== undefined && (
                        <div>
                          <p className="text-gray-400 font-medium">Experience</p>
                          <p className="text-white">{agent.agentInfo.experience} years</p>
                        </div>
                      )}
                      {agent.agentInfo.listings !== undefined && (
                        <div>
                          <p className="text-gray-400 font-medium">Listings</p>
                          <p className="text-white">{agent.agentInfo.listings}</p>
                        </div>
                      )}
                      {agent.agentInfo.sales !== undefined && (
                        <div>
                          <p className="text-gray-400 font-medium">Sales</p>
                          <p className="text-white">{agent.agentInfo.sales}</p>
                        </div>
                      )}
                    </div>

                    {agent.agentInfo.specializations && agent.agentInfo.specializations.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 font-medium mb-1">Specializations</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.agentInfo.specializations.map((spec, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="builders">
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-500">Verified Builders</h2>

            {builders.length === 0 ? (
              <div className="text-center py-12 bg-gray-700 rounded-lg">
                <p className="text-gray-400">No verified builders found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {builders.map((builder) => (
                  <div key={builder._id} className="border rounded-lg overflow-hidden bg-gray-700">
                    <div className="relative h-40 w-full">
                      <Image
                        src={""}
                        alt={builder.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-gray-800 rounded-md shadow-md p-1">
                        <div className="relative h-10 w-10">
                          <Image
                            src={""}
                            alt={`${builder.title} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-lg text-orange-500">{builder.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mt-1">{builder.description}</p>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-400 font-medium">Established</p>
                          <p className="text-white">{builder.established}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Headquarters</p>
                          <p className="text-white">{builder.headquarters}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Rating</p>
                          <p className="text-white">{builder.rating.toFixed(1)} / 5</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Projects</p>
                          <p className="text-white">{builder.projects}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-400 font-medium mb-1">Specialization</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-600 text-white">
                          {builder.specialization}
                        </span>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                            {builder.completed} Completed
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                            {builder.ongoing} Ongoing
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
