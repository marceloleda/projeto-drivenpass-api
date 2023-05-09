import { prisma } from "@/config";
import { networkCreat } from "@/protocols";
import { Network } from "@prisma/client";

async function networkCreate(data: networkCreat, encryptedPassword: string) {
    return prisma.network.create({
      data: {
        ...data,
        password: encryptedPassword
      },
    });
}
async function getNetworkById(userId: number, id: number) {
    const network = await prisma.network.findUnique({
        where: {
            id,
        },
    });

    if (!network || network.userId !== userId) {
        return null;
    }
    return network;
}
async function findNetworks(userId: number) {
    const networks: Network[] = await prisma.network.findMany({
      where: {
        userId,
      },
    });
  
    return networks;
}
async function deleteNetworkById(userId: number, id: number) {
    const net = await prisma.network.delete({
      where: {
        id,
      },
    });
  
    return net;
  }

const networkRepository = {
    networkCreate,
    getNetworkById,
    findNetworks,
    deleteNetworkById
};

export default networkRepository;
