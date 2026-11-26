import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/theme";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = "Удалить",
  cancelText = "Отмена",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, destructive && styles.destructiveBtn]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(27,28,34,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.goldBright,
    alignItems: "center",
  },
  confirmText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "700",
  },
  destructiveBtn: {
    backgroundColor: colors.expense,
  },
});
